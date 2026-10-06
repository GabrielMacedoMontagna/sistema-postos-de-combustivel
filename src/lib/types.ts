export type Bandeira =
	| 'VIBRA'
	| 'IPIRANGA'
	| 'RAIZEN' // Shell
	| 'ALE'
	| 'ATEM'
	| 'RODOIL'
	| 'DISLUB'
	| 'BANDEIRA BRANCA'
	| 'OUTRA';

export interface PrecosCombustivel {
	gasolinaComum?: number | null;
	gasolinaAditivada?: number | null;
	etanol?: number | null;
	dieselS10?: number | null;
	dieselComum?: number | null;
	gnv?: number | null;
	dataAtualizacao?: string | null;
	fonte?: string; // e.g. "Levantamento ANP", "Dados Abertos", "Colaborativo"
}

export interface ConectorEletrico {
	tipo: 'Type 2 (Mennekes)' | 'CCS 2' | 'CHAdeMO' | 'GBT' | 'Tesla Supercharger' | 'Outro' | string;
	potenciaKw: number;
	quantidade?: number;
	corrente?: string;
	status?: 'disponivel' | 'ocupado' | 'em_manutencao' | 'desconhecido';
}

export interface EletropostoInfo {
	temEletroposto: boolean;
	qtdEstacoes?: number | null;
	potenciaMaxKw?: number | null;
	conectores?: ConectorEletrico[];
	precoKwh?: number | null; // e.g. 2.10
	tarifaGratuita?: boolean;
	redeOperadora?: string | null; // e.g. "Shell Recharge", "Raízen Power", "Tupinambá", "Volvo Recharge", "EZVolt"
	observacoes?: string | null;
}

export type StatusFiscalizacao = 'REGULAR' | 'PENDENTE' | 'NOTIFICADO' | 'INTERDITADO' | 'NAO_INFORMADO';

export interface FiscalizacaoANP {
	codigoSimp?: string;
	numeroAutorizacao?: string;
	dataVinculacaoBandeira?: string;
	statusAutorizacao: 'AUTORIZADO' | 'PENDENTE' | 'INTERDITADO' | 'REVOGADO' | 'NAO_INFORMADO';
	statusFiscalizacao: StatusFiscalizacao;
	dataUltimaFiscalizacao?: string | null;
	resultadoQualidade?: 'CONFORME' | 'NAO_CONFORME' | 'EM_ANALISE' | 'NAO_AVALIADO';
	conformidadeVolumetrica?: boolean | null; // Litro correto verificado pela ANP / IPEM
	amostrasColetadas?: number;
	historicoInfracoes?: string[];
	seloQualidadeAnp: boolean;
	anpComVcUrl: string;
	observacoes?: string | null;
}

export interface ServicosPosto {
	conveniencia: boolean;
	nomeConveniencia?: string | null; // "Select", "AM/PM", "BR Mania", "Stop & Go"
	calibrador: boolean;
	trocaOleo: boolean;
	lavagem: boolean;
	aberto24h: boolean;
	farmacia?: boolean;
	banheiros?: boolean;
	banheiroAcessivel?: boolean;
	restaurante?: boolean;
	lanchonete?: boolean;
	caixaEletronico?: boolean;
	formasPagamento?: string[];
}

export interface EnderecoPosto {
	logradouro: string;
	numero?: string;
	complemento?: string;
	bairro: string;
	municipio: string;
	uf: string;
	cep?: string;
}

export interface Coordenadas {
	lat: number;
	lng: number;
}

export interface PostoCombustivel {
	id: string; // CNPJ ou id único
	nome: string; // Nome fantasia comercial
	razaoSocial: string;
	cnpj: string;
	bandeira: Bandeira | string;
	bandeiraBranca: boolean;
	corBandeira?: string;
	endereco: EnderecoPosto;
	coordenadas: Coordenadas;
	distanciaKm?: number;
	precos: PrecosCombustivel;
	eletroposto: EletropostoInfo;
	fiscalizacao: FiscalizacaoANP;
	servicos: ServicosPosto;
	telefone?: string;
	horarioFuncionamento?: string;
	avaliacaoMedia?: number;
	totalAvaliacoes?: number;
	completudeDados: {
		precos: boolean;
		eletroposto: boolean;
		fiscalizacao: boolean;
		servicos: boolean;
		porcentagem: number;
	};
}

export interface FiltrosBusca {
	texto?: string;
	cidade?: string;
	uf?: string;
	bandeira?: string;
	apenasEletrico?: boolean;
	apenasConveniencia?: boolean;
	apenas24h?: boolean;
	apenasFiscalizados?: boolean;
	combustivel?: 'gasolinaComum' | 'etanol' | 'dieselS10' | 'gnv' | 'todos';
	ordenarPor?: 'relevancia' | 'distancia' | 'menor_preco' | 'fiscalizacao';
	raioKm?: number;
	usuarioLat?: number;
	usuarioLng?: number;
}
