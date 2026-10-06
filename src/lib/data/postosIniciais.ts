import type { PostoCombustivel } from '#lib/types';

function calcularCompletude(p: Partial<PostoCombustivel>): PostoCombustivel['completudeDados'] {
	const temPrecos = Boolean(
		p.precos && (p.precos.gasolinaComum || p.precos.etanol || p.precos.dieselS10 || p.precos.gnv)
	);
	const temEletroposto = Boolean(p.eletroposto && p.eletroposto.temEletroposto);
	const temFiscalizacao = Boolean(
		p.fiscalizacao && p.fiscalizacao.statusFiscalizacao !== 'NAO_INFORMADO'
	);
	const temServicos = Boolean(
		p.servicos &&
			(p.servicos.conveniencia ||
				p.servicos.calibrador ||
				p.servicos.trocaOleo ||
				p.servicos.lavagem ||
				p.servicos.aberto24h)
	);

	let preenchidos = 0;
	if (temPrecos) preenchidos++;
	if (p.fiscalizacao) preenchidos++;
	if (p.eletroposto !== undefined) preenchidos++;
	if (temServicos) preenchidos++;

	const porcentagem = Math.round((preenchidos / 4) * 100);

	return {
		precos: temPrecos,
		eletroposto: temEletroposto,
		fiscalizacao: temFiscalizacao,
		servicos: temServicos,
		porcentagem
	};
}

export const POSTOS_INICIAIS: PostoCombustivel[] = [
	// ==================== SÃO PAULO ====================
	{
		id: '01234567000101',
		cnpj: '01234567000101',
		nome: 'Posto Shell Paulista V-Power & Recharge',
		razaoSocial: 'Auto Posto Av Paulista e Comercio de Derivados Ltda',
		bandeira: 'RAIZEN',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Paulista',
			numero: '1842',
			bairro: 'Bela Vista',
			municipio: 'São Paulo',
			uf: 'SP',
			cep: '01310-200'
		},
		coordenadas: { lat: -23.5598, lng: -46.6575 },
		precos: {
			gasolinaComum: 5.89,
			gasolinaAditivada: 6.19,
			etanol: 3.99,
			dieselS10: 6.09,
			dieselComum: null,
			gnv: null,
			dataAtualizacao: '2026-10-05T14:30:00Z',
			fonte: 'Levantamento de Preços ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 4,
			potenciaMaxKw: 150,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 150, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 2, status: 'disponivel' }
			],
			precoKwh: 2.15,
			tarifaGratuita: false,
			redeOperadora: 'Shell Recharge',
			observacoes: 'Carregamento ultrarrápido DC até 150kW. Pagamento via app Shell Box ou cartão.'
		},
		fiscalizacao: {
			codigoSimp: '1084920',
			numeroAutorizacao: 'PR/SP0492810',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-18',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=01234567000101',
			observacoes: 'Todas as bombas com lacres intactos e aferição volumétrica 100% precisa.'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Shell Select Gourmet',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true,
			caixaEletronico: true
		},
		horarioFuncionamento: '24 horas',
		telefone: '(11) 3289-4100',
		avaliacaoMedia: 4.8,
		totalAvaliacoes: 412,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '02345678000112',
		cnpj: '02345678000112',
		nome: 'Posto Petrobras Faria Lima BR Mania',
		razaoSocial: 'Comercial de Combustíveis Faria Lima S.A.',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Brigadeiro Faria Lima',
			numero: '2230',
			bairro: 'Jardim Paulistano',
			municipio: 'São Paulo',
			uf: 'SP',
			cep: '01452-000'
		},
		coordenadas: { lat: -23.5786, lng: -46.6892 },
		precos: {
			gasolinaComum: 5.92,
			gasolinaAditivada: 6.25,
			etanol: 3.95,
			dieselS10: 6.12,
			dieselComum: null,
			gnv: 4.79,
			dataAtualizacao: '2026-10-04T09:15:00Z',
			fonte: 'Levantamento de Preços ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 50,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 50, quantidade: 2, status: 'disponivel' },
				{ tipo: 'CHAdeMO', potenciaKw: 50, quantidade: 1, status: 'disponivel' }
			],
			precoKwh: 1.95,
			tarifaGratuita: false,
			redeOperadora: 'Vibra Eletroposto / EZVolt',
			observacoes: 'Estações rápidas integradas ao aplicativo Premmia.'
		},
		fiscalizacao: {
			codigoSimp: '1051934',
			numeroAutorizacao: 'PR/SP0192841',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-25',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 8,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=02345678000112',
			observacoes: 'Amostras aprovadas no PMQC com teor de etanol anidro em 27%.'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true,
			restaurante: true
		},
		horarioFuncionamento: '24 horas',
		telefone: '(11) 3031-8890',
		avaliacaoMedia: 4.6,
		totalAvaliacoes: 320,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '03456789000123',
		cnpj: '03456789000123',
		nome: 'Auto Posto Econômico Tiradentes (Bandeira Branca)',
		razaoSocial: 'Auto Posto Nova Esperanca do Pari Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Avenida Tiradentes',
			numero: '750',
			bairro: 'Bom Retiro',
			municipio: 'São Paulo',
			uf: 'SP',
			cep: '01102-000'
		},
		coordenadas: { lat: -23.5312, lng: -46.6315 },
		precos: {
			gasolinaComum: 5.49,
			gasolinaAditivada: null,
			etanol: 3.59,
			dieselS10: 5.79,
			dieselComum: 5.65,
			gnv: null,
			dataAtualizacao: '2026-10-06T08:00:00Z',
			fonte: 'Coleta de Preços Colaborativa'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null,
			observacoes: 'Não dispõe de infraestrutura de recarga para carros elétricos.'
		},
		fiscalizacao: {
			codigoSimp: '1099231',
			numeroAutorizacao: 'PR/SP0388192',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-07-12',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 4,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=03456789000123',
			observacoes: 'Posto independente vistoriado. Bomba e combustível aprovados.'
		},
		servicos: {
			conveniencia: false,
			calibrador: true,
			trocaOleo: false,
			lavagem: false,
			aberto24h: false,
			banheiros: true
		},
		horarioFuncionamento: 'Segunda a Sábado: 06h às 22h',
		telefone: '(11) 3326-1029',
		avaliacaoMedia: 4.2,
		totalAvaliacoes: 189,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},
	{
		id: '04567890000134',
		cnpj: '04567890000134',
		nome: 'Posto Ipiranga Rebouças',
		razaoSocial: 'Serviços Automotivos Rebouças S/A',
		bandeira: 'IPIRANGA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Rebouças',
			numero: '3100',
			bairro: 'Pinheiros',
			municipio: 'São Paulo',
			uf: 'SP',
			cep: '05402-000'
		},
		coordenadas: { lat: -23.5714, lng: -46.6908 },
		precos: {
			gasolinaComum: 5.87,
			gasolinaAditivada: 6.15,
			etanol: 3.89,
			dieselS10: 6.05,
			dieselComum: null,
			gnv: 4.69,
			dataAtualizacao: '2026-10-05T18:00:00Z',
			fonte: 'Levantamento de Preços ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 60,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 60, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 1, status: 'disponivel' }
			],
			precoKwh: 2.1,
			tarifaGratuita: false,
			redeOperadora: 'Tupinambá Energia / Ipiranga',
			observacoes: 'Ativação via app Tupinambá ou Abastece Aí com desconto.'
		},
		fiscalizacao: {
			codigoSimp: '1077189',
			numeroAutorizacao: 'PR/SP0298190',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-06-10',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=04567890000134'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'AM/PM',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.5,
		totalAvaliacoes: 284,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '05678901000145',
		cnpj: '05678901000145',
		nome: 'Posto Estação da Luz (Dados Parciais)',
		razaoSocial: 'Auto Posto Luz Central Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Rua Brigadeiro Tobias',
			numero: '450',
			bairro: 'Centro Histórico',
			municipio: 'São Paulo',
			uf: 'SP',
			cep: '01032-000'
		},
		coordenadas: { lat: -23.5385, lng: -46.6348 },
		precos: {
			gasolinaComum: null, // Sem preços informados online propositalmente
			gasolinaAditivada: null,
			etanol: null,
			dieselS10: null,
			dieselComum: null,
			gnv: null,
			dataAtualizacao: null,
			fonte: 'Não informado recentemente'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: null,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null,
			observacoes: 'Informação não cadastrada na base de eletromobilidade.'
		},
		fiscalizacao: {
			codigoSimp: '1029182',
			numeroAutorizacao: 'PR/SP0019283',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'PENDENTE',
			dataUltimaFiscalizacao: '2025-11-20',
			resultadoQualidade: 'EM_ANALISE',
			conformidadeVolumetrica: null,
			amostrasColetadas: 2,
			historicoInfracoes: ['Aguardando resultado de laudo laboratorial'],
			seloQualidadeAnp: false,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=05678901000145'
		},
		servicos: {
			conveniencia: false,
			calibrador: true,
			trocaOleo: false,
			lavagem: false,
			aberto24h: false,
			banheiros: false
		},
		horarioFuncionamento: 'Segunda a Sábado: 07h às 19h',
		avaliacaoMedia: 3.8,
		totalAvaliacoes: 45,
		completudeDados: {
			precos: false,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 50
		}
	},

	// ==================== CURITIBA ====================
	{
		id: '11223344000155',
		cnpj: '11223344000155',
		nome: 'Posto Shell Batel EletroPark',
		razaoSocial: 'Batel Combustiveis e Energia S/A',
		bandeira: 'RAIZEN',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida do Batel',
			numero: '1550',
			bairro: 'Batel',
			municipio: 'Curitiba',
			uf: 'PR',
			cep: '80420-090'
		},
		coordenadas: { lat: -25.4442, lng: -49.2891 },
		precos: {
			gasolinaComum: 5.79,
			gasolinaAditivada: 6.09,
			etanol: 3.99,
			dieselS10: 5.99,
			dieselComum: null,
			gnv: 4.59,
			dataAtualizacao: '2026-10-06T07:30:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 6,
			potenciaMaxKw: 160,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 160, quantidade: 4, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 2, status: 'disponivel' }
			],
			precoKwh: 2.1,
			tarifaGratuita: false,
			redeOperadora: 'Shell Recharge / Volvo',
			observacoes: 'Hub de recarga ultrarrápida no Batel com lounge climatizado e Wi-Fi.'
		},
		fiscalizacao: {
			codigoSimp: '1098471',
			numeroAutorizacao: 'PR/PR0192841',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-02',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 8,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=11223344000155'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Shell Select Café & Bistro',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true,
			restaurante: true
		},
		horarioFuncionamento: '24 horas',
		telefone: '(41) 3342-9988',
		avaliacaoMedia: 4.9,
		totalAvaliacoes: 540,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '22334455000166',
		cnpj: '22334455000166',
		nome: 'Posto Petrobras Jardim Botânico',
		razaoSocial: 'Auto Posto Botânico de Curitiba Ltda',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Prefeito Lothário Meissner',
			numero: '600',
			bairro: 'Jardim Botânico',
			municipio: 'Curitiba',
			uf: 'PR',
			cep: '80210-170'
		},
		coordenadas: { lat: -25.4412, lng: -49.2435 },
		precos: {
			gasolinaComum: 5.75,
			gasolinaAditivada: 5.99,
			etanol: 3.94,
			dieselS10: 5.94,
			dieselComum: null,
			gnv: 4.55,
			dataAtualizacao: '2026-10-05T11:00:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 50,
			conectores: [{ tipo: 'CCS 2', potenciaKw: 50, quantidade: 2, status: 'disponivel' }],
			precoKwh: 1.89,
			tarifaGratuita: false,
			redeOperadora: 'Copel Eletroposto / Vibra',
			observacoes: 'Ponto oficial da eletrovia paranaense Copel.'
		},
		fiscalizacao: {
			codigoSimp: '1074821',
			numeroAutorizacao: 'PR/PR0092812',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-11',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=22334455000166'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.6,
		totalAvaliacoes: 210,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '33445566000177',
		cnpj: '33445566000177',
		nome: 'Auto Posto Linha Verde (Bandeira Branca)',
		razaoSocial: 'Auto Posto BR 476 Derivados de Petróleo Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Avenida Senador Salgado Filho',
			numero: '3100',
			bairro: 'Uberaba',
			municipio: 'Curitiba',
			uf: 'PR',
			cep: '81570-000'
		},
		coordenadas: { lat: -25.4682, lng: -49.2319 },
		precos: {
			gasolinaComum: 5.39,
			gasolinaAditivada: null,
			etanol: 3.55,
			dieselS10: 5.69,
			dieselComum: 5.59,
			gnv: 4.45,
			dataAtualizacao: '2026-10-06T06:40:00Z',
			fonte: 'Dados Abertos ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1049281',
			numeroAutorizacao: 'PR/PR0219842',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-07-28',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=33445566000177'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Conveniência Linha Verde',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true,
			restaurante: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.3,
		totalAvaliacoes: 310,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== RIO DE JANEIRO ====================
	{
		id: '44556677000188',
		cnpj: '44556677000188',
		nome: 'Posto Ipiranga Copacabana Posto 4',
		razaoSocial: 'Petróleo Copacabana Ltda',
		bandeira: 'IPIRANGA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Nossa Senhora de Copacabana',
			numero: '680',
			bairro: 'Copacabana',
			municipio: 'Rio de Janeiro',
			uf: 'RJ',
			cep: '22050-000'
		},
		coordenadas: { lat: -22.9721, lng: -43.1873 },
		precos: {
			gasolinaComum: 5.99,
			gasolinaAditivada: 6.35,
			etanol: 4.19,
			dieselS10: 6.25,
			dieselComum: null,
			gnv: 4.89,
			dataAtualizacao: '2026-10-05T16:20:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 60,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 60, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 1, status: 'disponivel' }
			],
			precoKwh: 2.25,
			tarifaGratuita: false,
			redeOperadora: 'Tupinambá / Ipiranga',
			observacoes: 'Estação de recarga rápida localizada a 2 quadras da praia de Copacabana.'
		},
		fiscalizacao: {
			codigoSimp: '1061984',
			numeroAutorizacao: 'PR/RJ0182941',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-30',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=44556677000188'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'AM/PM Café',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.7,
		totalAvaliacoes: 480,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '55667788000199',
		cnpj: '55667788000199',
		nome: 'Posto Vibra Aterro do Flamengo',
		razaoSocial: 'Comercial Flamengo de Combustíveis Ltda',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Praia do Flamengo',
			numero: '244',
			bairro: 'Flamengo',
			municipio: 'Rio de Janeiro',
			uf: 'RJ',
			cep: '22210-030'
		},
		coordenadas: { lat: -22.9298, lng: -43.1762 },
		precos: {
			gasolinaComum: 5.95,
			gasolinaAditivada: 6.29,
			etanol: 4.15,
			dieselS10: 6.19,
			dieselComum: null,
			gnv: 4.85,
			dataAtualizacao: '2026-10-06T09:00:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 4,
			potenciaMaxKw: 120,
			conectores: [{ tipo: 'CCS 2', potenciaKw: 120, quantidade: 4, status: 'disponivel' }],
			precoKwh: 2.19,
			tarifaGratuita: false,
			redeOperadora: 'Vibra Eletroposto',
			observacoes: 'Recarga rápida de alta potência com vista para a Baía de Guanabara.'
		},
		fiscalizacao: {
			codigoSimp: '1088491',
			numeroAutorizacao: 'PR/RJ0293812',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-12',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 7,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=55667788000199'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.8,
		totalAvaliacoes: 350,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '66778899000100',
		cnpj: '66778899000100',
		nome: 'Posto Barra Marapendi (Bandeira Branca)',
		razaoSocial: 'Auto Posto Marapendi da Barra Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Avenida das Américas',
			numero: '4200',
			bairro: 'Barra da Tijuca',
			municipio: 'Rio de Janeiro',
			uf: 'RJ',
			cep: '22640-102'
		},
		coordenadas: { lat: -23.0005, lng: -43.3458 },
		precos: {
			gasolinaComum: 5.69,
			gasolinaAditivada: 5.95,
			etanol: 3.89,
			dieselS10: 5.89,
			dieselComum: null,
			gnv: 4.49,
			dataAtualizacao: '2026-10-04T15:00:00Z',
			fonte: 'Dados Abertos ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1039821',
			numeroAutorizacao: 'PR/RJ0019284',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'NOTIFICADO',
			dataUltimaFiscalizacao: '2026-05-14',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: false,
			amostrasColetadas: 5,
			historicoInfracoes: [
				'Bico 3 da bomba 2 interditado preventivamente para calibração de volume (IPEM/ANP)'
			],
			seloQualidadeAnp: false,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=66778899000100',
			observacoes: 'Combustível com qualidade conforme, porém notificado para ajuste métrico em bico.'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Mini Mercado Barra',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 3.9,
		totalAvaliacoes: 145,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== BELO HORIZONTE ====================
	{
		id: '77889900000111',
		cnpj: '77889900000111',
		nome: 'Posto Shell Savassi Power & Eletro',
		razaoSocial: 'Companhia de Petróleo Savassi Ltda',
		bandeira: 'RAIZEN',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida do Contorno',
			numero: '6200',
			bairro: 'Savassi',
			municipio: 'Belo Horizonte',
			uf: 'MG',
			cep: '30110-042'
		},
		coordenadas: { lat: -19.9387, lng: -43.9358 },
		precos: {
			gasolinaComum: 5.84,
			gasolinaAditivada: 6.14,
			etanol: 3.92,
			dieselS10: 5.98,
			dieselComum: null,
			gnv: 4.65,
			dataAtualizacao: '2026-10-06T08:15:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 4,
			potenciaMaxKw: 100,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 100, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 2, status: 'disponivel' }
			],
			precoKwh: 2.05,
			tarifaGratuita: false,
			redeOperadora: 'Shell Recharge / CEMIG SIM',
			observacoes: 'Eletroposto rápido no coração da Savassi com recarga 100% energia limpa.'
		},
		fiscalizacao: {
			codigoSimp: '1091283',
			numeroAutorizacao: 'PR/MG0192842',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-08',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=77889900000111'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Shell Select',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.8,
		totalAvaliacoes: 390,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '88990011000122',
		cnpj: '88990011000122',
		nome: 'Posto ALE Pampulha',
		razaoSocial: 'Auto Posto Lagoa da Pampulha Ltda',
		bandeira: 'ALE',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Presidente Antônio Carlos',
			numero: '7500',
			bairro: 'São Luiz',
			municipio: 'Belo Horizonte',
			uf: 'MG',
			cep: '31270-010'
		},
		coordenadas: { lat: -19.8524, lng: -43.9582 },
		precos: {
			gasolinaComum: 5.69,
			gasolinaAditivada: 5.95,
			etanol: 3.79,
			dieselS10: 5.85,
			dieselComum: null,
			gnv: 4.55,
			dataAtualizacao: '2026-10-05T12:00:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1067291',
			numeroAutorizacao: 'PR/MG0082912',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-07-19',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=88990011000122'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Entreposto ALE',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.4,
		totalAvaliacoes: 195,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== BRASÍLIA ====================
	{
		id: '99001122000133',
		cnpj: '99001122000133',
		nome: 'Posto Petrobras Asa Sul 214',
		razaoSocial: 'Comercio de Combustiveis Planalto Central Ltda',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'SQS 214 Bloco A',
			numero: 's/n',
			bairro: 'Asa Sul',
			municipio: 'Brasília',
			uf: 'DF',
			cep: '70293-000'
		},
		coordenadas: { lat: -15.8239, lng: -47.9258 },
		precos: {
			gasolinaComum: 5.82,
			gasolinaAditivada: 6.12,
			etanol: 3.85,
			dieselS10: 5.95,
			dieselComum: null,
			gnv: 4.75,
			dataAtualizacao: '2026-10-06T09:10:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 4,
			potenciaMaxKw: 150,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 150, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 2, status: 'disponivel' }
			],
			precoKwh: 2.15,
			tarifaGratuita: false,
			redeOperadora: 'Vibra / Neoenergia',
			observacoes: 'Hub ultrarrápido com recarga de até 80% em 25 minutos.'
		},
		fiscalizacao: {
			codigoSimp: '1098234',
			numeroAutorizacao: 'PR/DF0192841',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-22',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=99001122000133'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania Café',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.8,
		totalAvaliacoes: 410,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '10111213000144',
		cnpj: '10111213000144',
		nome: 'Posto Jarjour Asa Norte 310',
		razaoSocial: 'Jarjour Petróleo e Derivados Ltda',
		bandeira: 'IPIRANGA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'SHCN SQ 310 Bloco A',
			numero: 's/n',
			bairro: 'Asa Norte',
			municipio: 'Brasília',
			uf: 'DF',
			cep: '70756-000'
		},
		coordenadas: { lat: -15.7684, lng: -47.8895 },
		precos: {
			gasolinaComum: 5.79,
			gasolinaAditivada: 6.09,
			etanol: 3.79,
			dieselS10: 5.92,
			dieselComum: null,
			gnv: null,
			dataAtualizacao: '2026-10-05T17:40:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 50,
			conectores: [{ tipo: 'CCS 2', potenciaKw: 50, quantidade: 2, status: 'disponivel' }],
			precoKwh: 1.99,
			tarifaGratuita: false,
			redeOperadora: 'Tupinambá / Ipiranga'
		},
		fiscalizacao: {
			codigoSimp: '1048291',
			numeroAutorizacao: 'PR/DF0081923',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-14',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=10111213000144'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'AM/PM Padaria',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.6,
		totalAvaliacoes: 315,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},

	// ==================== PORTO ALEGRE ====================
	{
		id: '12131415000155',
		cnpj: '12131415000155',
		nome: 'Posto Ipiranga Moinhos de Vento',
		razaoSocial: 'Auto Posto Padre Chagas Comércio Ltda',
		bandeira: 'IPIRANGA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Rua Padre Chagas',
			numero: '410',
			bairro: 'Moinhos de Vento',
			municipio: 'Porto Alegre',
			uf: 'RS',
			cep: '90570-080'
		},
		coordenadas: { lat: -30.0264, lng: -51.2012 },
		precos: {
			gasolinaComum: 5.89,
			gasolinaAditivada: 6.22,
			etanol: 4.19,
			dieselS10: 6.05,
			dieselComum: null,
			gnv: 4.89,
			dataAtualizacao: '2026-10-06T08:30:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 60,
			conectores: [{ tipo: 'CCS 2', potenciaKw: 60, quantidade: 2, status: 'disponivel' }],
			precoKwh: 2.15,
			tarifaGratuita: false,
			redeOperadora: 'Zletric / Ipiranga',
			observacoes: 'Estação de recarga rápida integrada ao ecossistema Zletric.'
		},
		fiscalizacao: {
			codigoSimp: '1078291',
			numeroAutorizacao: 'PR/RS0192842',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-04',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=12131415000155'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'AM/PM Café',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.7,
		totalAvaliacoes: 290,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '13141516000166',
		cnpj: '13141516000166',
		nome: 'Posto Rodoil Terceira Perimetral',
		razaoSocial: 'Rodoil Combustíveis e Serviços Sul Ltda',
		bandeira: 'RODOIL',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Carlos Gomes',
			numero: '1300',
			bairro: 'Auxiliadora',
			municipio: 'Porto Alegre',
			uf: 'RS',
			cep: '90480-001'
		},
		coordenadas: { lat: -30.0211, lng: -51.1865 },
		precos: {
			gasolinaComum: 5.69,
			gasolinaAditivada: 5.99,
			etanol: 4.05,
			dieselS10: 5.89,
			dieselComum: null,
			gnv: null,
			dataAtualizacao: '2026-10-05T14:15:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1049182',
			numeroAutorizacao: 'PR/RS0082914',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-06-25',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=13141516000166'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Parada Rodoil',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.4,
		totalAvaliacoes: 180,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== SALVADOR ====================
	{
		id: '14151617000177',
		cnpj: '14151617000177',
		nome: 'Posto Petrobras Farol da Barra',
		razaoSocial: 'Auto Posto Mar da Bahia Ltda',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Oceânica',
			numero: '950',
			bairro: 'Barra',
			municipio: 'Salvador',
			uf: 'BA',
			cep: '40140-130'
		},
		coordenadas: { lat: -13.0089, lng: -38.5285 },
		precos: {
			gasolinaComum: 5.98,
			gasolinaAditivada: 6.29,
			etanol: 4.25,
			dieselS10: 6.15,
			dieselComum: null,
			gnv: 4.79,
			dataAtualizacao: '2026-10-06T08:45:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 2,
			potenciaMaxKw: 50,
			conectores: [{ tipo: 'CCS 2', potenciaKw: 50, quantidade: 2, status: 'disponivel' }],
			precoKwh: 2.1,
			tarifaGratuita: false,
			redeOperadora: 'Neoenergia / Vibra',
			observacoes: 'Ponto de recarga com linda vista para a orla de Salvador.'
		},
		fiscalizacao: {
			codigoSimp: '1081923',
			numeroAutorizacao: 'PR/BA0192842',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-20',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=14151617000177'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania Farol',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.7,
		totalAvaliacoes: 340,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '15161718000188',
		cnpj: '15161718000188',
		nome: 'Auto Posto Paralela (Bandeira Branca)',
		razaoSocial: 'Auto Posto Rápido da Paralela Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Avenida Luís Viana Filho (Paralela)',
			numero: '6100',
			bairro: 'Patamares',
			municipio: 'Salvador',
			uf: 'BA',
			cep: '41680-400'
		},
		coordenadas: { lat: -12.9465, lng: -38.4124 },
		precos: {
			gasolinaComum: 5.59,
			gasolinaAditivada: null,
			etanol: 3.89,
			dieselS10: 5.79,
			dieselComum: null,
			gnv: 4.49,
			dataAtualizacao: '2026-10-05T10:30:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1041923',
			numeroAutorizacao: 'PR/BA0081920',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-07-03',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=15161718000188'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Empório Paralela',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.3,
		totalAvaliacoes: 215,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== RECIFE ====================
	{
		id: '16171819000199',
		cnpj: '16171819000199',
		nome: 'Posto Shell Boa Viagem',
		razaoSocial: 'Combustíveis e Serviços Boa Viagem Ltda',
		bandeira: 'RAIZEN',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Engenheiro Domingos Ferreira',
			numero: '2400',
			bairro: 'Boa Viagem',
			municipio: 'Recife',
			uf: 'PE',
			cep: '51020-031'
		},
		coordenadas: { lat: -8.1158, lng: -34.8965 },
		precos: {
			gasolinaComum: 5.92,
			gasolinaAditivada: 6.25,
			etanol: 4.19,
			dieselS10: 6.09,
			dieselComum: null,
			gnv: 4.69,
			dataAtualizacao: '2026-10-06T08:00:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 3,
			potenciaMaxKw: 80,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 80, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 1, status: 'disponivel' }
			],
			precoKwh: 2.15,
			tarifaGratuita: false,
			redeOperadora: 'Shell Recharge',
			observacoes: 'Carregador rápido próximo à praia e aos principais hotéis de Boa Viagem.'
		},
		fiscalizacao: {
			codigoSimp: '1092812',
			numeroAutorizacao: 'PR/PE0192841',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-18',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=16171819000199'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Shell Select Gourmet',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.7,
		totalAvaliacoes: 380,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '17181920000100',
		cnpj: '17181920000100',
		nome: 'Posto Dislub Agamenon Magalhães',
		razaoSocial: 'Dislub Distribuidora de Combustíveis S/A',
		bandeira: 'DISLUB',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Avenida Governador Agamenon Magalhães',
			numero: '3500',
			bairro: 'Graças',
			municipio: 'Recife',
			uf: 'PE',
			cep: '52010-040'
		},
		coordenadas: { lat: -8.0432, lng: -34.8972 },
		precos: {
			gasolinaComum: 5.69,
			gasolinaAditivada: 5.95,
			etanol: 3.99,
			dieselS10: 5.89,
			dieselComum: null,
			gnv: 4.59,
			dataAtualizacao: '2026-10-05T15:30:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1059281',
			numeroAutorizacao: 'PR/PE0092814',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-07-15',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 5,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=17181920000100'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Loja Convém Dislub',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.5,
		totalAvaliacoes: 210,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	},

	// ==================== CAMPINAS ====================
	{
		id: '18192021000111',
		cnpj: '18192021000111',
		nome: 'Posto Petrobras Cambuí Eletroposto',
		razaoSocial: 'Auto Posto Cambuí Campinas Ltda',
		bandeira: 'VIBRA',
		bandeiraBranca: false,
		endereco: {
			logradouro: 'Rua Coronel Silva Teles',
			numero: '700',
			bairro: 'Cambuí',
			municipio: 'Campinas',
			uf: 'SP',
			cep: '13024-001'
		},
		coordenadas: { lat: -22.8985, lng: -47.0512 },
		precos: {
			gasolinaComum: 5.79,
			gasolinaAditivada: 6.09,
			etanol: 3.79,
			dieselS10: 5.95,
			dieselComum: null,
			gnv: 4.65,
			dataAtualizacao: '2026-10-06T07:50:00Z',
			fonte: 'Levantamento ANP'
		},
		eletroposto: {
			temEletroposto: true,
			qtdEstacoes: 4,
			potenciaMaxKw: 120,
			conectores: [
				{ tipo: 'CCS 2', potenciaKw: 120, quantidade: 2, status: 'disponivel' },
				{ tipo: 'Type 2 (Mennekes)', potenciaKw: 22, quantidade: 2, status: 'disponivel' }
			],
			precoKwh: 2.05,
			tarifaGratuita: false,
			redeOperadora: 'CPFL Eletromobilidade / Vibra',
			observacoes: 'Hub ultrarrápido CPFL com totem informativo e carregamento de motos e carros.'
		},
		fiscalizacao: {
			codigoSimp: '1098492',
			numeroAutorizacao: 'PR/SP0492812',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-09-15',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 7,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=18192021000111'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'BR Mania Café & Lounge',
			calibrador: true,
			trocaOleo: true,
			lavagem: false,
			aberto24h: true,
			banheiros: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.8,
		totalAvaliacoes: 320,
		completudeDados: {
			precos: true,
			eletroposto: true,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 100
		}
	},
	{
		id: '19202122000122',
		cnpj: '19202122000122',
		nome: 'Auto Posto Dom Pedro (Bandeira Branca)',
		razaoSocial: 'Auto Posto Dom Pedro Derivados Ltda',
		bandeira: 'BANDEIRA BRANCA',
		bandeiraBranca: true,
		endereco: {
			logradouro: 'Rodovia Dom Pedro I',
			numero: 'km 137',
			bairro: 'Parque Imperador',
			municipio: 'Campinas',
			uf: 'SP',
			cep: '13091-904'
		},
		coordenadas: { lat: -22.8423, lng: -47.0315 },
		precos: {
			gasolinaComum: 5.39,
			gasolinaAditivada: null,
			etanol: 3.49,
			dieselS10: 5.65,
			dieselComum: 5.55,
			gnv: 4.39,
			dataAtualizacao: '2026-10-06T06:15:00Z',
			fonte: 'Dados Abertos ANP'
		},
		eletroposto: {
			temEletroposto: false,
			qtdEstacoes: 0,
			conectores: [],
			precoKwh: null,
			tarifaGratuita: false,
			redeOperadora: null
		},
		fiscalizacao: {
			codigoSimp: '1048192',
			numeroAutorizacao: 'PR/SP0091823',
			statusAutorizacao: 'AUTORIZADO',
			statusFiscalizacao: 'REGULAR',
			dataUltimaFiscalizacao: '2026-08-01',
			resultadoQualidade: 'CONFORME',
			conformidadeVolumetrica: true,
			amostrasColetadas: 6,
			historicoInfracoes: [],
			seloQualidadeAnp: true,
			anpComVcUrl: 'https://anpcomvcpostos.anp.gov.br/#busca_cnpj=19202122000122'
		},
		servicos: {
			conveniencia: true,
			nomeConveniencia: 'Restaurante e Parada Dom Pedro',
			calibrador: true,
			trocaOleo: true,
			lavagem: true,
			aberto24h: true,
			banheiros: true,
			restaurante: true
		},
		horarioFuncionamento: '24 horas',
		avaliacaoMedia: 4.5,
		totalAvaliacoes: 410,
		completudeDados: {
			precos: true,
			eletroposto: false,
			fiscalizacao: true,
			servicos: true,
			porcentagem: 75
		}
	}
];

// Helper to calculate completeness on all
for (const posto of POSTOS_INICIAIS) {
	posto.completudeDados = calcularCompletude(posto);
}
