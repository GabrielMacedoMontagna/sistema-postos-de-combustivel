<script lang="ts">
	import {
		Zap,
		Store,
		ShieldCheck,
		Clock,
		ArrowUpDown,
		RotateCcw,
		Fuel,
		SlidersHorizontal,
		Check
	} from '@lucide/svelte';
	import type { FiltrosBusca } from '#lib/types';

	interface Props {
		filtros: FiltrosBusca;
		totalResultados: number;
		cidadeAtual: string;
		onAtualizarFiltro: <K extends keyof FiltrosBusca>(chave: K, valor: FiltrosBusca[K]) => void;
		onLimparFiltros: () => void;
	}

	let {
		filtros,
		totalResultados,
		cidadeAtual,
		onAtualizarFiltro,
		onLimparFiltros
	}: Props = $props();

	const bandeiras = [
		{ id: 'todas', label: 'Todas as Bandeiras' },
		{ id: 'VIBRA', label: 'Petrobras / Vibra' },
		{ id: 'IPIRANGA', label: 'Ipiranga' },
		{ id: 'RAIZEN', label: 'Shell / Raízen' },
		{ id: 'BANDEIRA BRANCA', label: 'Bandeira Branca' },
		{ id: 'ALE', label: 'ALE' },
		{ id: 'RODOIL', label: 'Rodoil' },
		{ id: 'DISLUB', label: 'Dislub' }
	];

	const combustiveis = [
		{ id: 'todos', label: 'Todos os Combustíveis' },
		{ id: 'gasolinaComum', label: 'Gasolina Comum' },
		{ id: 'etanol', label: 'Etanol' },
		{ id: 'dieselS10', label: 'Diesel S10' },
		{ id: 'gnv', label: 'GNV' }
	];

	const temFiltroAtivo = $derived(
		Boolean(
			filtros.bandeira ||
			filtros.apenasEletrico ||
			filtros.apenasConveniencia ||
			filtros.apenas24h ||
			filtros.apenasFiscalizados ||
			(filtros.combustivel && filtros.combustivel !== 'todos') ||
			filtros.texto
		)
	);
</script>

<div class="bg-white border-b border-slate-200/90 shadow-2xs py-3 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto flex flex-col gap-3">
		
		<!-- Linha Principal: Chips Rápidos e Ordenação -->
		<div class="flex flex-wrap items-center justify-between gap-2.5">
			
			<!-- Chips de Filtros Rápidos -->
			<div class="flex flex-wrap items-center gap-2">
				
				<!-- Seletor de Bandeira -->
				<select
					value={filtros.bandeira || 'todas'}
					onchange={(e) => onAtualizarFiltro('bandeira', e.currentTarget.value === 'todas' ? undefined : e.currentTarget.value)}
					class="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-3 rounded-full border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
				>
					{#each bandeiras as b}
						<option value={b.id}>{b.label}</option>
					{/each}
				</select>

				<!-- Seletor de Combustível Principal -->
				<select
					value={filtros.combustivel || 'todos'}
					onchange={(e) => onAtualizarFiltro('combustivel', e.currentTarget.value as FiltrosBusca['combustivel'])}
					class="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-3 rounded-full border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
				>
					{#each combustiveis as c}
						<option value={c.id}>{c.label}</option>
					{/each}
				</select>

				<!-- Toggle: Eletroposto EV -->
				<button
					type="button"
					onclick={() => onAtualizarFiltro('apenasEletrico', !filtros.apenasEletrico)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all {filtros.apenasEletrico ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
				>
					<Zap class="w-3.5 h-3.5 {filtros.apenasEletrico ? 'fill-white' : 'text-amber-500'}" />
					<span>Com Eletroposto (EV)</span>
					{#if filtros.apenasEletrico}
						<Check class="w-3 h-3 ml-0.5" />
					{/if}
				</button>

				<!-- Toggle: Conveniência -->
				<button
					type="button"
					onclick={() => onAtualizarFiltro('apenasConveniencia', !filtros.apenasConveniencia)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all {filtros.apenasConveniencia ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
				>
					<Store class="w-3.5 h-3.5" />
					<span>Conveniência</span>
				</button>

				<!-- Toggle: Fiscalização Regular ANP -->
				<button
					type="button"
					onclick={() => onAtualizarFiltro('apenasFiscalizados', !filtros.apenasFiscalizados)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all {filtros.apenasFiscalizados ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
				>
					<ShieldCheck class="w-3.5 h-3.5 {filtros.apenasFiscalizados ? 'text-white' : 'text-emerald-600'}" />
					<span>ANP Aprovado</span>
				</button>

				<!-- Toggle: Aberto 24h -->
				<button
					type="button"
					onclick={() => onAtualizarFiltro('apenas24h', !filtros.apenas24h)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all {filtros.apenas24h ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
				>
					<Clock class="w-3.5 h-3.5" />
					<span>Aberto 24h</span>
				</button>

				<!-- Botão Resetar se houver filtros -->
				{#if temFiltroAtivo}
					<button
						type="button"
						onclick={onLimparFiltros}
						class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
						title="Limpar todos os filtros aplicados"
					>
						<RotateCcw class="w-3 h-3" />
						<span>Limpar Filtros</span>
					</button>
				{/if}

			</div>

			<!-- Lado Direito: Total de Postos e Ordenação -->
			<div class="flex items-center gap-3 ml-auto">
				
				<span class="text-xs text-slate-500 font-medium">
					<strong class="text-slate-800 font-bold">{totalResultados}</strong> {totalResultados === 1 ? 'posto encontrado' : 'postos encontrados'}
					{#if cidadeAtual}
						em <span class="text-blue-600 font-semibold">{cidadeAtual}</span>
					{/if}
				</span>

				<div class="flex items-center gap-1.5 text-xs text-slate-600">
					<ArrowUpDown class="w-3.5 h-3.5 text-slate-400" />
					<select
						value={filtros.ordenarPor || 'relevancia'}
						onchange={(e) => onAtualizarFiltro('ordenarPor', e.currentTarget.value as FiltrosBusca['ordenarPor'])}
						class="text-xs font-semibold bg-transparent hover:bg-slate-100 text-slate-700 py-1 pl-2 pr-6 rounded-lg border border-slate-200 focus:outline-hidden cursor-pointer"
					>
						<option value="relevancia">Relevância</option>
						<option value="distancia">Mais Próximo</option>
						<option value="menor_preco">Menor Preço</option>
						<option value="fiscalizacao">Fiscalização ANP</option>
					</select>
				</div>

			</div>

		</div>

	</div>
</div>
