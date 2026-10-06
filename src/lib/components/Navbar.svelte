<script lang="ts">
	import {
		Fuel,
		Zap,
		MapPin,
		Search,
		Calculator,
		ShieldCheck,
		Compass,
		Layers,
		LayoutGrid,
		Map as MapIcon,
		X,
		ChevronDown,
		Navigation,
		Loader2
	} from '@lucide/svelte';
	import type { EstadoInfo, CidadeInfo } from '#lib/services/postosClient';

	interface Props {
		estados: EstadoInfo[];
		estadoSelecionado: string;
		cidades: CidadeInfo[];
		cidadeSelecionadaSlug: string;
		buscaTexto: string;
		modoVisualizacao: 'hibrido' | 'mapa' | 'lista';
		totalPostos: number;
		totalEletropostos: number;
		carregandoPostos: boolean;
		carregandoLocalizacao: boolean;
		raioKm?: number | null;
		pontoReferenciaNome?: string | null;
		onSelecionarEstado: (uf: string) => void;
		onSelecionarCidade: (cidadeSlug: string) => void;
		onBuscarTexto: (texto: string) => void;
		onBuscarEndereco: (texto: string) => void;
		onAlterarRaio?: (raio: number | null) => void;
		onLimparPontoReferencia?: () => void;
		onMudarModo: (modo: 'hibrido' | 'mapa' | 'lista') => void;
		onUsarLocalizacao: () => void;
		onAbrirCalculadora: () => void;
		onAbrirGuiaANP: () => void;
	}

	let {
		estados = [],
		estadoSelecionado = 'SP',
		cidades = [],
		cidadeSelecionadaSlug = '',
		buscaTexto = $bindable(),
		modoVisualizacao = $bindable(),
		totalPostos,
		totalEletropostos,
		carregandoPostos,
		carregandoLocalizacao,
		raioKm = null,
		pontoReferenciaNome = null,
		onSelecionarEstado,
		onSelecionarCidade,
		onBuscarTexto,
		onBuscarEndereco,
		onAlterarRaio,
		onLimparPontoReferencia,
		onMudarModo,
		onUsarLocalizacao,
		onAbrirCalculadora,
		onAbrirGuiaANP
	}: Props = $props();

	let inputBusca = $state(buscaTexto);
	let buscandoGeocodificacao = $state(false);

	$effect(() => {
		inputBusca = buscaTexto;
	});

	function handleSubmitBusca(e: Event) {
		e.preventDefault();
		if (!inputBusca.trim()) return;

		// Se parecer com um endereço/rua/avenida/CEP, dispara geocodificação
		const t = inputBusca.trim().toLowerCase();
		const ehEndereco =
			t.startsWith('r.') ||
			t.startsWith('rua') ||
			t.startsWith('av') ||
			t.startsWith('avenida') ||
			t.startsWith('estrada') ||
			t.startsWith('rod') ||
			t.startsWith('rodovia') ||
			t.startsWith('bairro') ||
			t.startsWith('praça') ||
			t.startsWith('praca') ||
			t.includes(' nº') ||
			t.includes(' n°') ||
			/^\d{5}-?\d{3}$/.test(t) || // CEP
			/,\s*\d+/.test(t); // número após vírgula

		if (ehEndereco) {
			buscandoGeocodificacao = true;
			onBuscarEndereco(inputBusca);
			setTimeout(() => {
				buscandoGeocodificacao = false;
			}, 1500);
		} else {
			onBuscarTexto(inputBusca);
		}
	}

	function handleLimparBusca() {
		inputBusca = '';
		onBuscarTexto('');
	}

	function handleBuscarEnderecoManual() {
		if (!inputBusca.trim()) return;
		buscandoGeocodificacao = true;
		onBuscarEndereco(inputBusca);
		setTimeout(() => {
			buscandoGeocodificacao = false;
		}, 1500);
	}
</script>

<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 gap-3">
			
			<!-- Logo & Título -->
			<div class="flex items-center gap-3 shrink-0">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
					<Fuel class="w-5 h-5" />
				</div>
				<div>
					<div class="flex items-center gap-1.5">
						<span class="font-extrabold text-lg tracking-tight text-slate-900">Posto<span class="text-blue-600">Radar</span></span>
						<span class="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md">ANP Oficial</span>
					</div>
					<p class="text-[11px] text-slate-500 hidden sm:block">Consulta Nacional • 27 Estados • Eletropostos</p>
				</div>
			</div>

			<!-- Seletores UF e Cidade em Destaque -->
			<div class="flex items-center gap-1.5 shrink-0">
				<!-- Seletor de Estado (UF) -->
				<div class="relative">
					<select
						value={estadoSelecionado}
						onchange={(e) => onSelecionarEstado(e.currentTarget.value)}
						class="text-xs sm:text-sm font-bold bg-blue-50 hover:bg-blue-100/80 text-blue-900 py-2 pl-2.5 pr-7 rounded-xl border border-blue-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs transition-colors"
						title="Selecione o Estado (UF)"
					>
						{#if estados.length === 0}
							<option value="SP">SP</option>
						{:else}
							{#each estados as est}
								<option value={est.sigla}>
									{est.sigla} - {est.nome}
								</option>
							{/each}
						{/if}
					</select>
					<div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-blue-700">
						<ChevronDown class="w-3.5 h-3.5" />
					</div>
				</div>

				<!-- Seletor de Cidade (Município) -->
				<div class="relative">
					<select
						value={cidadeSelecionadaSlug}
						onchange={(e) => onSelecionarCidade(e.currentTarget.value)}
						class="text-xs sm:text-sm font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 py-2 pl-2.5 pr-7 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none shadow-2xs transition-colors max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate"
						title="Selecione o Município"
					>
						{#if cidades.length === 0}
							<option value="">Carregando...</option>
						{:else}
							{#each cidades as cid}
								<option value={cid.slug}>
									{cid.nome} ({cid.postosCount} {cid.postosCount === 1 ? 'posto' : 'postos'})
								</option>
							{/each}
						{/if}
					</select>
					<div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-500">
						<ChevronDown class="w-3.5 h-3.5" />
					</div>
				</div>
			</div>

			<!-- Barra de Busca Central -->
			<div class="flex-1 max-w-lg mx-1">
				<form onsubmit={handleSubmitBusca} class="relative flex items-center">
					<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
						{#if buscandoGeocodificacao || carregandoPostos}
							<Loader2 class="w-4 h-4 text-blue-600 animate-spin" />
						{:else}
							<Search class="w-4 h-4" />
						{/if}
					</div>
					<input
						type="text"
						bind:value={inputBusca}
						placeholder="Buscar posto, rua, bairro, CEP ou endereço..."
						class="w-full pl-9 pr-24 py-2 text-xs sm:text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-hidden"
					/>
					{#if inputBusca}
						<button
							type="button"
							onclick={handleLimparBusca}
							class="absolute right-16 p-1 text-slate-400 hover:text-slate-600 transition-colors"
							aria-label="Limpar busca"
						>
							<X class="w-3.5 h-3.5" />
						</button>
					{/if}
					<button
						type="submit"
						class="absolute right-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-1"
					>
						Buscar
					</button>
				</form>
			</div>

			<!-- Ações à Direita: GPS, Calculadora, Modos de Visão -->
			<div class="flex items-center gap-2">

				<!-- Botão Usar GPS / Perto de Mim -->
				<button
					type="button"
					onclick={onUsarLocalizacao}
					disabled={carregandoLocalizacao}
					title="Usar minha localização GPS atual"
					class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/60 text-slate-700 hover:text-blue-700 transition-all disabled:opacity-50"
				>
					<Compass class="w-3.5 h-3.5 text-blue-600 {carregandoLocalizacao ? 'animate-spin' : ''}" />
					<span class="hidden sm:inline">{carregandoLocalizacao ? 'Localizando...' : 'Perto de Mim'}</span>
				</button>

				<!-- Botão Calculadora 70% Paridade -->
				<button
					type="button"
					onclick={onAbrirCalculadora}
					title="Calculadora de Paridade Etanol vs Gasolina (Regra dos 70%)"
					class="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 transition-colors"
				>
					<Calculator class="w-3.5 h-3.5 text-emerald-600" />
					<span>Etanol 70%</span>
				</button>

				<!-- Botão Guia Fiscalização ANP -->
				<button
					type="button"
					onclick={onAbrirGuiaANP}
					title="Direitos do Consumidor e Guia de Fiscalização da ANP"
					class="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
				>
					<ShieldCheck class="w-3.5 h-3.5 text-blue-600" />
					<span>Guia ANP</span>
				</button>

				<!-- Alternador de Modo de Visualização (Desktop) -->
				<div class="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
					<button
						type="button"
						onclick={() => onMudarModo('hibrido')}
						class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 {modoVisualizacao === 'hibrido' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}"
						title="Visualização Híbrida: Mapa e Lista Lado a Lado"
					>
						<Layers class="w-3.5 h-3.5" />
						<span class="hidden md:inline">Dividido</span>
					</button>
					<button
						type="button"
						onclick={() => onMudarModo('lista')}
						class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 {modoVisualizacao === 'lista' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}"
						title="Visualização Apenas Lista"
					>
						<LayoutGrid class="w-3.5 h-3.5" />
						<span class="hidden md:inline">Lista</span>
					</button>
					<button
						type="button"
						onclick={() => onMudarModo('mapa')}
						class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 {modoVisualizacao === 'mapa' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}"
						title="Visualização Apenas Mapa"
					>
						<MapIcon class="w-3.5 h-3.5" />
						<span class="hidden md:inline">Mapa</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Faixa Informativa de Raio de Busca por Endereço se Ativo -->
		{#if pontoReferenciaNome}
			<div class="py-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
				<div class="flex items-center gap-2 text-blue-800 font-medium">
					<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700">
						<Navigation class="w-3 h-3" />
					</span>
					<span>Postos próximos a: <strong class="text-blue-900">{pontoReferenciaNome}</strong></span>
					{#if raioKm}
						<span class="px-2 py-0.5 rounded-full bg-blue-100 font-bold text-blue-800">
							Raio de {raioKm} km
						</span>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					{#if onAlterarRaio}
						<span class="text-slate-500 text-[11px]">Ajustar raio:</span>
						<button
							type="button"
							onclick={() => onAlterarRaio(5)}
							class="px-2 py-0.5 rounded-md font-semibold text-[11px] {raioKm === 5 ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
						>
							5 km
						</button>
						<button
							type="button"
							onclick={() => onAlterarRaio(10)}
							class="px-2 py-0.5 rounded-md font-semibold text-[11px] {raioKm === 10 ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
						>
							10 km
						</button>
						<button
							type="button"
							onclick={() => onAlterarRaio(20)}
							class="px-2 py-0.5 rounded-md font-semibold text-[11px] {raioKm === 20 ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
						>
							20 km
						</button>
						<button
							type="button"
							onclick={() => onAlterarRaio(null)}
							class="px-2 py-0.5 rounded-md font-semibold text-[11px] {!raioKm ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}"
						>
							Sem raio
						</button>
					{/if}

					{#if onLimparPontoReferencia}
						<button
							type="button"
							onclick={onLimparPontoReferencia}
							class="ml-2 text-slate-400 hover:text-red-600 p-1 flex items-center gap-1 font-semibold"
							title="Remover ponto de referência e ver todos do estado"
						>
							<X class="w-3.5 h-3.5" />
							<span>Remover</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</header>
