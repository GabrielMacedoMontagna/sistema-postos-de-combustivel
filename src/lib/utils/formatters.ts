import type { Bandeira } from '#lib/types';

export function formatarCNPJ(cnpj: string): string {
	const limpo = cnpj.replace(/\D/g, '');
	if (limpo.length !== 14) return cnpj;
	return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatarPreco(valor?: number | null): string {
	if (valor === undefined || valor === null || isNaN(valor)) {
		return 'Não inf.';
	}
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 3
	}).format(valor);
}

export function formatarPrecoKwh(valor?: number | null, gratuito?: boolean): string {
	if (gratuito) return 'Gratuito';
	if (valor === undefined || valor === null || isNaN(valor)) return 'Não inf.';
	return `R$ ${valor.toFixed(2).replace('.', ',')} / kWh`;
}

export function formatarCEP(cep?: string): string {
	if (!cep) return '';
	const limpo = cep.replace(/\D/g, '');
	if (limpo.length !== 8) return cep;
	return limpo.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export interface ParidadeCombustivel {
	razao: number; // e.g. 68.5%
	recomendacao: 'etanol' | 'gasolina' | 'indiferente';
	mensagem: string;
	porcentagemEconomia: number;
}

export function calcularParidadeEtanolGasolina(
	precoEtanol?: number | null,
	precoGasolina?: number | null
): ParidadeCombustivel | null {
	if (!precoEtanol || !precoGasolina || precoGasolina <= 0 || precoEtanol <= 0) {
		return null;
	}

	const razao = (precoEtanol / precoGasolina) * 100;
	const pontoNeutro = 70.0;

	if (razao < 69.5) {
		const economia = (1 - razao / 70) * 100;
		return {
			razao: Number(razao.toFixed(1)),
			recomendacao: 'etanol',
			mensagem: `Etanol a ${razao.toFixed(1)}% da Gasolina (Compensa abastecer com Etanol)`,
			porcentagemEconomia: Number(economia.toFixed(1))
		};
	} else if (razao > 70.5) {
		const diferenca = ((razao - 70) / 70) * 100;
		return {
			razao: Number(razao.toFixed(1)),
			recomendacao: 'gasolina',
			mensagem: `Etanol a ${razao.toFixed(1)}% da Gasolina (Compensa abastecer com Gasolina)`,
			porcentagemEconomia: Number(diferenca.toFixed(1))
		};
	} else {
		return {
			razao: Number(razao.toFixed(1)),
			recomendacao: 'indiferente',
			mensagem: `Etanol a exatos ${razao.toFixed(1)}% da Gasolina (Rendimento equivalente)`,
			porcentagemEconomia: 0
		};
	}
}

export interface InfoBandeira {
	nome: string;
	corFundo: string;
	corTexto: string;
	corBorda: string;
	corHex: string;
	isBranca: boolean;
	descricao: string;
}

export function getInfoBandeira(bandeira: string | Bandeira, isBranca?: boolean): InfoBandeira {
	const b = (bandeira || '').toUpperCase().trim();

	if (isBranca || b.includes('BRANCA')) {
		return {
			nome: 'Bandeira Branca',
			corFundo: 'bg-zinc-100 dark:bg-zinc-800',
			corTexto: 'text-zinc-700 dark:text-zinc-200',
			corBorda: 'border-zinc-300 dark:border-zinc-700',
			corHex: '#71717a',
			isBranca: true,
			descricao: 'Posto independente sem exclusividade com distribuidora de marca.'
		};
	}

	if (b.includes('VIBRA') || b.includes('PETROBRAS') || b.includes('BR')) {
		return {
			nome: 'Petrobras / Vibra',
			corFundo: 'bg-emerald-50 dark:bg-emerald-950/40',
			corTexto: 'text-emerald-700 dark:text-emerald-300',
			corBorda: 'border-emerald-300 dark:border-emerald-700',
			corHex: '#059669',
			isBranca: false,
			descricao: 'Rede oficial de postos Petrobras (Vibra Energia).'
		};
	}

	if (b.includes('IPIRANGA')) {
		return {
			nome: 'Ipiranga',
			corFundo: 'bg-amber-50 dark:bg-amber-950/40',
			corTexto: 'text-amber-800 dark:text-amber-300',
			corBorda: 'border-amber-300 dark:border-amber-700',
			corHex: '#d97706',
			isBranca: false,
			descricao: 'Rede de postos Ipiranga com lojas AM/PM e Jet Oil.'
		};
	}

	if (b.includes('RAIZEN') || b.includes('SHELL')) {
		return {
			nome: 'Shell / Raízen',
			corFundo: 'bg-rose-50 dark:bg-rose-950/40',
			corTexto: 'text-rose-700 dark:text-rose-300',
			corBorda: 'border-rose-300 dark:border-rose-700',
			corHex: '#e11d48',
			isBranca: false,
			descricao: 'Rede de postos Shell operada pela Raízen (Shell V-Power).'
		};
	}

	if (b.includes('ALE')) {
		return {
			nome: 'ALE Combustíveis',
			corFundo: 'bg-indigo-50 dark:bg-indigo-950/40',
			corTexto: 'text-indigo-700 dark:text-indigo-300',
			corBorda: 'border-indigo-300 dark:border-indigo-700',
			corHex: '#4f46e5',
			isBranca: false,
			descricao: 'Rede de postos ALE Combustíveis.'
		};
	}

	if (b.includes('RODOIL')) {
		return {
			nome: 'Rodoil',
			corFundo: 'bg-cyan-50 dark:bg-cyan-950/40',
			corTexto: 'text-cyan-700 dark:text-cyan-300',
			corBorda: 'border-cyan-300 dark:border-cyan-700',
			corHex: '#0891b2',
			isBranca: false,
			descricao: 'Distribuidora regional Rodoil.'
		};
	}

	if (b.includes('ATEM')) {
		return {
			nome: 'Atem',
			corFundo: 'bg-orange-50 dark:bg-orange-950/40',
			corTexto: 'text-orange-700 dark:text-orange-300',
			corBorda: 'border-orange-300 dark:border-orange-700',
			corHex: '#ea580c',
			isBranca: false,
			descricao: 'Distribuidora de combustíveis Atem.'
		};
	}

	return {
		nome: bandeira || 'Bandeira Branca',
		corFundo: 'bg-slate-100 dark:bg-slate-800',
		corTexto: 'text-slate-700 dark:text-slate-300',
		corBorda: 'border-slate-300 dark:border-slate-700',
		corHex: '#64748b',
		isBranca: false,
		descricao: `Distribuidora: ${bandeira}`
	};
}
