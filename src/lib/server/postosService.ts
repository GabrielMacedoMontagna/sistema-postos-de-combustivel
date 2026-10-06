import { POSTOS_INICIAIS } from '#lib/data/postosIniciais';
import type { FiltrosBusca, PostoCombustivel } from '#lib/types';
import { calcularDistanciaKm, CIDADES_BRASIL } from '#lib/utils/geo';

let bancoPostos: PostoCombustivel[] = [...POSTOS_INICIAIS];

export function getTodosPostos(): PostoCombustivel[] {
	return bancoPostos;
}

export function getPostoPorId(idOuCnpj: string): PostoCombustivel | undefined {
	const limpo = idOuCnpj.replace(/\D/g, '');
	return bancoPostos.find(
		(p) => p.id === idOuCnpj || p.cnpj.replace(/\D/g, '') === limpo || p.id === limpo
	);
}

export function buscarPostos(filtros: FiltrosBusca): {
	total: number;
	postos: PostoCombustivel[];
	cidadeCentro?: { lat: number; lng: number; nome: string };
} {
	let resultado = [...bancoPostos];

	// 1. Filtragem por texto livre (nome, razão social, bairro, cidade, rua, cnpj)
	if (filtros.texto && filtros.texto.trim()) {
		const termo = filtros.texto.toLowerCase().trim();
		const termoLimpoCnpj = termo.replace(/\D/g, '');

		resultado = resultado.filter((p) => {
			const noNome = p.nome.toLowerCase().includes(termo);
			const naRazao = p.razaoSocial.toLowerCase().includes(termo);
			const noBairro = p.endereco.bairro.toLowerCase().includes(termo);
			const naCidade = p.endereco.municipio.toLowerCase().includes(termo);
			const naRua = p.endereco.logradouro.toLowerCase().includes(termo);
			const naBandeira = p.bandeira.toLowerCase().includes(termo);
			const noCnpj = termoLimpoCnpj && p.cnpj.replace(/\D/g, '').includes(termoLimpoCnpj);

			return noNome || naRazao || noBairro || naCidade || naRua || naBandeira || noCnpj;
		});
	}

	// 2. Filtragem por cidade e UF
	let cidadeCentro: { lat: number; lng: number; nome: string } | undefined;
	if (filtros.cidade && filtros.cidade.trim()) {
		const cNome = filtros.cidade.toLowerCase().trim();
		resultado = resultado.filter((p) => p.endereco.municipio.toLowerCase().includes(cNome));

		// Localiza coordenadas de centro da cidade caso cadastradas
		const entrada = Object.entries(CIDADES_BRASIL).find(([nome]) =>
			nome.toLowerCase().includes(cNome)
		);
		if (entrada) {
			const info = entrada[1];
			cidadeCentro = {
				lat: info.lat,
				lng: info.lng,
				nome: info.nome
			};
		}
	}

	if (filtros.uf && filtros.uf.trim()) {
		const ufBusca = filtros.uf.toUpperCase().trim();
		resultado = resultado.filter((p) => p.endereco.uf.toUpperCase() === ufBusca);
	}

	// 3. Filtragem por Bandeira
	if (filtros.bandeira && filtros.bandeira !== 'todas') {
		const bFiltro = filtros.bandeira.toUpperCase();
		if (bFiltro === 'BANDEIRA BRANCA') {
			resultado = resultado.filter((p) => p.bandeiraBranca);
		} else {
			resultado = resultado.filter(
				(p) => !p.bandeiraBranca && p.bandeira.toUpperCase().includes(bFiltro)
			);
		}
	}

	// 4. Filtragem por Eletroposto
	if (filtros.apenasEletrico) {
		resultado = resultado.filter((p) => p.eletroposto.temEletroposto);
	}

	// 5. Filtragem por Conveniência
	if (filtros.apenasConveniencia) {
		resultado = resultado.filter((p) => p.servicos.conveniencia);
	}

	// 6. Filtragem por Aberto 24h
	if (filtros.apenas24h) {
		resultado = resultado.filter((p) => p.servicos.aberto24h);
	}

	// 7. Filtragem por Fiscalização Regular
	if (filtros.apenasFiscalizados) {
		resultado = resultado.filter((p) => p.fiscalizacao.statusFiscalizacao === 'REGULAR');
	}

	// 8. Filtragem por tipo de combustível disponível
	if (filtros.combustivel && filtros.combustivel !== 'todos') {
		const cTipo = filtros.combustivel;
		resultado = resultado.filter((p) => {
			const valor = p.precos[cTipo as keyof typeof p.precos];
			return typeof valor === 'number' && valor > 0;
		});
	}

	// 9. Cálculo de distância se houver coordenadas de usuário ou centro
	const pontoReferencia =
		filtros.usuarioLat && filtros.usuarioLng
			? { lat: filtros.usuarioLat, lng: filtros.usuarioLng }
			: cidadeCentro
				? { lat: cidadeCentro.lat, lng: cidadeCentro.lng }
				: null;

	if (pontoReferencia) {
		resultado = resultado.map((p) => {
			const dist = calcularDistanciaKm(pontoReferencia, p.coordenadas);
			return { ...p, distanciaKm: dist };
		});

		// Filtro de raio se especificado
		if (filtros.raioKm && filtros.raioKm > 0) {
			resultado = resultado.filter((p) => (p.distanciaKm ?? 9999) <= (filtros.raioKm ?? 9999));
		}
	}

	// 10. Ordenação
	const ordenarPor = filtros.ordenarPor || (pontoReferencia ? 'distancia' : 'relevancia');

	resultado.sort((a, b) => {
		if (ordenarPor === 'distancia' && pontoReferencia) {
			const distA = a.distanciaKm ?? 9999;
			const distB = b.distanciaKm ?? 9999;
			return distA - distB;
		}

		if (ordenarPor === 'menor_preco') {
			const campo =
				filtros.combustivel && filtros.combustivel !== 'todos'
					? filtros.combustivel
					: 'gasolinaComum';
			const precoA = a.precos[campo as keyof typeof a.precos] ?? 9999;
			const precoB = b.precos[campo as keyof typeof b.precos] ?? 9999;
			return Number(precoA) - Number(precoB);
		}

		if (ordenarPor === 'fiscalizacao') {
			const rankStatus: Record<string, number> = {
				REGULAR: 1,
				PENDENTE: 2,
				NAO_INFORMADO: 3,
				NOTIFICADO: 4,
				INTERDITADO: 5
			};
			const rA = rankStatus[a.fiscalizacao.statusFiscalizacao] ?? 9;
			const rB = rankStatus[b.fiscalizacao.statusFiscalizacao] ?? 9;
			return rA - rB;
		}

		// Relevância padrão: completude de dados + avaliação
		const scoreA = (a.completudeDados.porcentagem || 50) + (a.avaliacaoMedia || 4) * 10;
		const scoreB = (b.completudeDados.porcentagem || 50) + (b.avaliacaoMedia || 4) * 10;
		return scoreB - scoreA;
	});

	return {
		total: resultado.length,
		postos: resultado,
		cidadeCentro
	};
}
