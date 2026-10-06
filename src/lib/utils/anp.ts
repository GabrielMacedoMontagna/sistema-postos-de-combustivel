import type { StatusFiscalizacao } from '#lib/types';

export interface InfoStatusFiscalizacao {
	status: StatusFiscalizacao;
	titulo: string;
	descricao: string;
	corBadge: string;
	corTexto: string;
	corIcone: string;
	corBorda: string;
	iconeNome: 'ShieldCheck' | 'ShieldAlert' | 'ShieldX' | 'ShieldQuestion' | 'Clock';
}

export function getInfoFiscalizacao(status: StatusFiscalizacao): InfoStatusFiscalizacao {
	switch (status) {
		case 'REGULAR':
			return {
				status: 'REGULAR',
				titulo: 'Conforme / Aprovado',
				descricao: 'Posto fiscalizado pela ANP com parâmetros de qualidade e volumetria regulares.',
				corBadge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
				corTexto: 'text-emerald-700 dark:text-emerald-300',
				corIcone: 'text-emerald-600 dark:text-emerald-400',
				corBorda: 'border-emerald-500',
				iconeNome: 'ShieldCheck'
			};
		case 'PENDENTE':
			return {
				status: 'PENDENTE',
				titulo: 'Em Análise / Pendente',
				descricao: 'Amostras de combustível em processo de ensaio laboratorial ou fiscalização em andamento.',
				corBadge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
				corTexto: 'text-amber-700 dark:text-amber-300',
				corIcone: 'text-amber-600 dark:text-amber-400',
				corBorda: 'border-amber-500',
				iconeNome: 'Clock'
			};
		case 'NOTIFICADO':
			return {
				status: 'NOTIFICADO',
				titulo: 'Notificado pela ANP',
				descricao: 'Posto notificado para adequação de documentação, equipamentos ou aferição de bico.',
				corBadge: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
				corTexto: 'text-orange-700 dark:text-orange-300',
				corIcone: 'text-orange-600 dark:text-orange-400',
				corBorda: 'border-orange-500',
				iconeNome: 'ShieldAlert'
			};
		case 'INTERDITADO':
			return {
				status: 'INTERDITADO',
				titulo: 'Interdição Registrada',
				descricao: 'Medida cautelar ou interdição de bico/tanque aplicada pela fiscalização da ANP.',
				corBadge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
				corTexto: 'text-rose-700 dark:text-rose-300',
				corIcone: 'text-rose-600 dark:text-rose-400',
				corBorda: 'border-rose-500',
				iconeNome: 'ShieldX'
			};
		case 'NAO_INFORMADO':
		default:
			return {
				status: 'NAO_INFORMADO',
				titulo: 'Dados Não Disponíveis',
				descricao: 'Sem dados de fiscalização publicados no portal da ANP nos últimos 12 meses.',
				corBadge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
				corTexto: 'text-zinc-600 dark:text-zinc-400',
				corIcone: 'text-zinc-400',
				corBorda: 'border-zinc-400',
				iconeNome: 'ShieldQuestion'
			};
	}
}

export function gerarLinkAnpComVc(cnpj?: string, codigoSimp?: string): string {
	const baseUrl = 'https://anpcomvcpostos.anp.gov.br/';
	if (!cnpj) return baseUrl;
	const cnpjLimpo = cnpj.replace(/\D/g, '');
	return `${baseUrl}#busca_cnpj=${cnpjLimpo}`;
}
