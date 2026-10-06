<script lang="ts">
	import { onMount } from 'svelte';
	import type { PostoCombustivel, FiltrosBusca } from '#lib/types';
	import {
		carregarEstados,
		carregarCidadesDoEstado,
		carregarPostosDaCidade,
		encontrarCidadeMaisProxima,
		geocodificarEndereco,
		filtrarPostosEmMemoria,
		type EstadoInfo,
		type CidadeInfo
	} from '#lib/services/postosClient';
	import Navbar from '#lib/components/Navbar.svelte';
	import FiltrosBar from '#lib/components/FiltrosBar.svelte';
	import PostoCard from '#lib/components/PostoCard.svelte';
	import MapaPostos from '#lib/components/MapaPostos.svelte';
	import PostoDetalhesModal from '#lib/components/PostoDetalhesModal.svelte';
	import CalculadoraModal from '#lib/components/CalculadoraModal.svelte';
	import GuiaANPModal from '#lib/components/GuiaANPModal.svelte';
	import BaseDadosModal from '#lib/components/BaseDadosModal.svelte';
	import {
		Fuel,
		Zap,
		MapPin,
		SearchX,
		RotateCcw,
		Layers,
		Map as MapIcon,
		LayoutGrid,
		Sparkles,
		ShieldCheck,
		AlertCircle,
		Loader2,
		Database
	} from '@lucide/svelte';

	// Estados reativos com Runes Svelte 5
	let estados = $state<EstadoInfo[]>([]);
	let estadoSelecionado = $state<string>('SP');
	let cidades = $state<CidadeInfo[]>([]);
	let cidadeSelecionadaSlug = $state<string>('');
	let postosDaCidade = $state<PostoCombustivel[]>([]);
	let itensExibidos = $state<number>(30);

	let buscaTexto = $state('');
	let filtros = $state<FiltrosBusca>({
		ordenarPor: 'relevancia'
	});

	let pontoReferencia = $state<{ lat: number; lng: number } | null>(null);
	let pontoReferenciaNome = $state<string | null>(null);
	let raioKm = $state<number | null>(null);

	let modoVisualizacao = $state<'hibrido' | 'mapa' | 'lista'>('hibrido');
	let modoMobile = $state<'lista' | 'mapa'>('lista');

	let postoSelecionado = $state<PostoCombustivel | null>(null);
	let postoModalDetalhes = $state<PostoCombustivel | null>(null);
	let modalCalculadoraAberto = $state(false);
	let modalGuiaANPAberto = $state(false);
	let modalBaseDadosAberto = $state(false);

	let localizacaoUsuario = $state<{ lat: number; lng: number } | null>(null);
	let carregandoLocalizacao = $state(false);
	let carregandoPostos = $state(true);

	let centroMapa = $state<{ lat: number; lng: number }>({
		lat: -23.55052,
		lng: -46.633308 // São Paulo por padrão
	});
	let zoomMapa = $state(13);

	let mensagemFeedback = $state<string | null>(null);
	let feedbackTimeout: ReturnType<typeof setTimeout> | null = null;

	// Cidade atualmente selecionada
	let cidadeAtualObj = $derived(
		cidades.find((c) => c.slug === cidadeSelecionadaSlug) || null
	);
	let cidadeAtualNome = $derived(cidadeAtualObj?.nome || '');

	// Filtragem instantânea reativa em memória (< 2ms)
	let resultadoFiltrado = $derived(
		filtrarPostosEmMemoria(
			postosDaCidade,
			{ ...filtros, texto: buscaTexto, cidade: '' },
			pontoReferencia || localizacaoUsuario,
			raioKm
		)
	);

	let postos = $derived(resultadoFiltrado.postos);
	let postosExibidos = $derived(postos.slice(0, itensExibidos));
	let totalResultados = $derived(resultadoFiltrado.total);
	let totalEletropostos = $derived(
		postosDaCidade.filter((p) => p.eletroposto?.temEletroposto).length
	);

	onMount(async () => {
		carregandoPostos = true;
		try {
			estados = await carregarEstados();
			cidades = await carregarCidadesDoEstado('SP');

			// Seleciona a primeira cidade (capital São Paulo) por padrão
			const cidadeInicial = cidades[0] || { slug: 'sao-paulo', lat: -23.5505, lng: -46.6333 };
			cidadeSelecionadaSlug = cidadeInicial.slug;

			postosDaCidade = await carregarPostosDaCidade('SP', cidadeSelecionadaSlug);

			centroMapa = { lat: cidadeInicial.lat, lng: cidadeInicial.lng };
			zoomMapa = 13;
		} catch (err) {
			console.error('Erro ao inicializar dados:', err);
			mostrarFeedback('Erro ao carregar lista inicial de postos.');
		} finally {
			carregandoPostos = false;
		}
	});

	function mostrarFeedback(msg: string) {
		if (feedbackTimeout) clearTimeout(feedbackTimeout);
		mensagemFeedback = msg;
		feedbackTimeout = setTimeout(() => {
			mensagemFeedback = null;
		}, 4500);
	}

	async function handleSelecionarEstado(uf: string) {
		if (uf === estadoSelecionado && postosDaCidade.length > 0) return;

		carregandoPostos = true;
		estadoSelecionado = uf;
		buscaTexto = '';
		pontoReferencia = null;
		pontoReferenciaNome = null;
		raioKm = null;
		postoSelecionado = null;
		itensExibidos = 30;

		try {
			cidades = await carregarCidadesDoEstado(uf);
			const cidadePadrao = cidades[0];

			if (cidadePadrao) {
				cidadeSelecionadaSlug = cidadePadrao.slug;
				centroMapa = { lat: cidadePadrao.lat, lng: cidadePadrao.lng };
				zoomMapa = 13;
				postosDaCidade = await carregarPostosDaCidade(uf, cidadePadrao.slug);
			} else {
				cidadeSelecionadaSlug = '';
				postosDaCidade = [];
			}
		} catch (err) {
			console.error(`Erro ao carregar dados do estado ${uf}:`, err);
			mostrarFeedback(`Não foi possível carregar as cidades do estado ${uf}.`);
		} finally {
			carregandoPostos = false;
		}
	}

	async function handleSelecionarCidade(slug: string) {
		if (slug === cidadeSelecionadaSlug && postosDaCidade.length > 0) return;

		carregandoPostos = true;
		cidadeSelecionadaSlug = slug;
		buscaTexto = '';
		pontoReferencia = null;
		pontoReferenciaNome = null;
		raioKm = null;
		postoSelecionado = null;
		itensExibidos = 30;

		const cid = cidades.find((c) => c.slug === slug);
		if (cid) {
			centroMapa = { lat: cid.lat, lng: cid.lng };
			zoomMapa = 13;
		}

		try {
			postosDaCidade = await carregarPostosDaCidade(estadoSelecionado, slug);
		} catch (err) {
			console.error(`Erro ao carregar postos da cidade ${slug}:`, err);
			mostrarFeedback(`Não foi possível carregar os postos de ${cid?.nome || slug}.`);
		} finally {
			carregandoPostos = false;
		}
	}

	async function handleCsvAtualizado() {
		carregandoPostos = true;
		try {
			cidades = await carregarCidadesDoEstado(estadoSelecionado);
			postosDaCidade = await carregarPostosDaCidade(estadoSelecionado, cidadeSelecionadaSlug);
			mostrarFeedback('Base de postos recalculada com sucesso a partir do CSV!');
		} catch (err) {
			console.error('Erro ao atualizar postos do CSV:', err);
			mostrarFeedback('Erro ao recalcular postos.');
		} finally {
			carregandoPostos = false;
		}
	}

	function handleBuscarTexto(texto: string) {
		buscaTexto = texto;
		itensExibidos = 30;
	}

	async function handleBuscarEndereco(termo: string) {
		carregandoPostos = true;
		try {
			const resultados = await geocodificarEndereco(termo, estadoSelecionado);
			if (resultados && resultados.length > 0) {
				const primeiro = resultados[0];

				// Se o endereço for identificado em uma cidade específica, atualiza estado e cidade
				const proxima = await encontrarCidadeMaisProxima(
					primeiro.lat,
					primeiro.lng,
					primeiro.uf || estadoSelecionado
				);

				if (proxima) {
					if (proxima.uf !== estadoSelecionado) {
						estadoSelecionado = proxima.uf;
						cidades = await carregarCidadesDoEstado(proxima.uf);
					}
					cidadeSelecionadaSlug = proxima.cidade.slug;
					postosDaCidade = await carregarPostosDaCidade(proxima.uf, proxima.cidade.slug);
				}

				pontoReferencia = { lat: primeiro.lat, lng: primeiro.lng };
				pontoReferenciaNome = primeiro.nomeFormatado;
				raioKm = 10;
				centroMapa = { lat: primeiro.lat, lng: primeiro.lng };
				zoomMapa = 14;
				filtros.ordenarPor = 'distancia';
				modoMobile = 'mapa';
				itensExibidos = 30;

				mostrarFeedback(`Localizado: ${primeiro.nomeFormatado.slice(0, 50)}...`);
			} else {
				mostrarFeedback(
					'Endereço não localizado. Tente digitar o nome da rua com número, bairro ou CEP.'
				);
			}
		} catch (err) {
			console.error('Erro na geocodificação:', err);
			mostrarFeedback('Não foi possível geocodificar o endereço no momento.');
		} finally {
			carregandoPostos = false;
		}
	}

	function handleAlterarRaio(novoRaio: number | null) {
		raioKm = novoRaio;
		itensExibidos = 30;
		if (pontoReferencia && novoRaio) {
			if (novoRaio <= 5) zoomMapa = 14;
			else if (novoRaio <= 10) zoomMapa = 13;
			else zoomMapa = 12;
		}
	}

	function handleLimparPontoReferencia() {
		pontoReferencia = null;
		pontoReferenciaNome = null;
		raioKm = null;
		itensExibidos = 30;
		if (filtros.ordenarPor === 'distancia' && !localizacaoUsuario) {
			filtros.ordenarPor = 'relevancia';
		}
	}

	function handleAtualizarFiltro<K extends keyof FiltrosBusca>(
		chave: K,
		valor: FiltrosBusca[K]
	) {
		filtros[chave] = valor;
		itensExibidos = 30;
	}

	function handleLimparFiltros() {
		buscaTexto = '';
		pontoReferencia = null;
		pontoReferenciaNome = null;
		raioKm = null;
		itensExibidos = 30;
		filtros = {
			ordenarPor: localizacaoUsuario ? 'distancia' : 'relevancia'
		};
	}

	function handleUsarLocalizacao() {
		if (!navigator.geolocation) {
			mostrarFeedback('Seu navegador não suporta geolocalização por GPS.');
			return;
		}

		carregandoLocalizacao = true;
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const lat = pos.coords.latitude;
				const lng = pos.coords.longitude;
				localizacaoUsuario = { lat, lng };
				pontoReferencia = { lat, lng };
				pontoReferenciaNome = 'Sua Localização GPS Atual';
				raioKm = 10;
				centroMapa = { lat, lng };
				zoomMapa = 14;
				filtros.ordenarPor = 'distancia';
				itensExibidos = 30;

				try {
					const proxima = await encontrarCidadeMaisProxima(lat, lng);
					if (proxima) {
						if (proxima.uf !== estadoSelecionado) {
							estadoSelecionado = proxima.uf;
							cidades = await carregarCidadesDoEstado(proxima.uf);
						}
						cidadeSelecionadaSlug = proxima.cidade.slug;
						postosDaCidade = await carregarPostosDaCidade(proxima.uf, proxima.cidade.slug);
					}
				} catch (e) {
					console.warn('Erro ao associar cidade ao GPS:', e);
				}

				carregandoLocalizacao = false;
				mostrarFeedback('Localização GPS detectada! Raio de 10 km ativado.');
			},
			(err) => {
				console.warn('Erro ao obter GPS:', err);
				mostrarFeedback(
					'Não foi possível obter sua localização exata. Verifique as permissões do navegador.'
				);
				carregandoLocalizacao = false;
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

	function handleFocarNoMapa(posto: PostoCombustivel) {
		postoSelecionado = posto;
		centroMapa = {
			lat: posto.coordenadas.lat,
			lng: posto.coordenadas.lng
		};
		zoomMapa = 16;
		modoMobile = 'mapa';
	}

	function handleSelecionarPosto(posto: PostoCombustivel) {
		postoSelecionado = posto;
	}

	function handleAbrirDetalhes(posto: PostoCombustivel) {
		postoModalDetalhes = posto;
	}
</script>

<svelte:head>
	<title>PostoRadar Brasil | Postos de Combustíveis por Município, Fiscalização ANP e Eletropostos</title>
	<meta
		name="description"
		content="Consulte postos de combustíveis no Brasil por estado e cidade, verifique regularidade ANP, busque por endereço ou CEP com raio de busca, compare preços de etanol e gasolina e encontre eletropostos."
	/>
</svelte:head>

<div class="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
	<!-- Topo de Navegação com Seletor Duplo de Estado e Cidade e Geocodificação -->
	<Navbar
		{estados}
		{estadoSelecionado}
		{cidades}
		{cidadeSelecionadaSlug}
		bind:buscaTexto
		bind:modoVisualizacao
		totalPostos={totalResultados}
		{totalEletropostos}
		{carregandoPostos}
		{carregandoLocalizacao}
		{raioKm}
		{pontoReferenciaNome}
		onSelecionarEstado={handleSelecionarEstado}
		onSelecionarCidade={handleSelecionarCidade}
		onBuscarTexto={handleBuscarTexto}
		onBuscarEndereco={handleBuscarEndereco}
		onAlterarRaio={handleAlterarRaio}
		onLimparPontoReferencia={handleLimparPontoReferencia}
		onMudarModo={(m) => (modoVisualizacao = m)}
		onUsarLocalizacao={handleUsarLocalizacao}
		onAbrirCalculadora={() => (modalCalculadoraAberto = true)}
		onAbrirGuiaANP={() => (modalGuiaANPAberto = true)}
	/>

	<!-- Barra de Filtros e Ordenação -->
	<FiltrosBar
		{filtros}
		{totalResultados}
		cidadeAtual={cidadeAtualNome}
		onAtualizarFiltro={handleAtualizarFiltro}
		onLimparFiltros={handleLimparFiltros}
	/>

	<!-- Toast de Notificação / Feedback de Busca -->
	{#if mensagemFeedback}
		<aside
			aria-label="Notificações"
			class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-xs text-white px-4 py-2.5 rounded-full shadow-xl border border-slate-700 text-xs flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200"
		>
			<AlertCircle class="w-4 h-4 text-blue-400 shrink-0" />
			<span class="truncate">{mensagemFeedback}</span>
			<button
				type="button"
				onclick={() => (mensagemFeedback = null)}
				class="ml-1 text-slate-400 hover:text-white"
			>
				&times;
			</button>
		</aside>
	{/if}

	<!-- Banner Informativo Rápido com Ativação ANP -->
	<div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2 text-xs">
		<div class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
			<div class="flex items-center gap-2">
				<ShieldCheck class="w-4 h-4 text-emerald-400 shrink-0" />
				<span>
					<strong>Dados Oficiais ANP ({cidadeAtualNome || 'Cidade'} - {estadoSelecionado}):</strong> {totalResultados} postos cadastrados com autorizações, misturas legais e pontos de recarga para carros elétricos.
				</span>
			</div>
			<div class="flex items-center gap-3 text-[11px] text-blue-200">
				<button
					type="button"
					onclick={() => (modalGuiaANPAberto = true)}
					class="underline hover:text-white transition-colors"
				>
					Entenda seus direitos na bomba
				</button>
				<span>•</span>
				<button
					type="button"
					onclick={() => (modalCalculadoraAberto = true)}
					class="underline hover:text-white transition-colors cursor-pointer"
				>
					Calculadora 70% Etanol
				</button>
				<span>•</span>
				<button
					type="button"
					onclick={() => (modalBaseDadosAberto = true)}
					class="underline hover:text-white transition-colors cursor-pointer font-semibold text-emerald-300"
				>
					Base ANP (CSV)
				</button>
			</div>
		</div>
	</div>

	<!-- Conteúdo Principal Dinâmico por Modo de Visualização -->
	<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col">
		<!-- 1. MODO HÍBRIDO (Split Screen: Lista e Mapa Lado a Lado) -->
		{#if modoVisualizacao === 'hibrido'}
			<!-- Alternador Mobile entre Lista e Mapa -->
			<div class="flex sm:hidden mb-3 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
				<button
					type="button"
					onclick={() => (modoMobile = 'lista')}
					class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 {modoMobile === 'lista' ? 'bg-blue-600 text-white' : 'text-slate-600'}"
				>
					<LayoutGrid class="w-3.5 h-3.5" />
					<span>Lista ({postos.length})</span>
				</button>
				<button
					type="button"
					onclick={() => (modoMobile = 'mapa')}
					class="flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 {modoMobile === 'mapa' ? 'bg-blue-600 text-white' : 'text-slate-600'}"
				>
					<MapIcon class="w-3.5 h-3.5" />
					<span>Mapa Interativo</span>
				</button>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[580px]">
				<!-- Coluna da Esquerda: Lista de Cards com Scroll Independente -->
				<div class="lg:col-span-6 xl:col-span-5 flex flex-col {modoMobile === 'mapa' ? 'hidden lg:flex' : 'flex'}">
					{#if carregandoPostos}
						<div class="bg-white rounded-2xl border border-slate-200 p-12 text-center my-auto">
							<Loader2 class="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
							<h3 class="text-sm font-bold text-slate-800">Carregando postos da cidade...</h3>
							<p class="text-xs text-slate-500 mt-1">
								Obtendo dados oficiais da ANP para {cidadeAtualNome || estadoSelecionado}.
							</p>
						</div>
					{:else if postos.length === 0}
						<div class="bg-white rounded-2xl border border-slate-200 p-8 text-center my-auto">
							<SearchX class="w-12 h-12 text-slate-300 mx-auto mb-3" />
							<h3 class="text-base font-bold text-slate-800">Nenhum posto encontrado</h3>
							<p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
								Não localizamos estabelecimentos para os filtros aplicados neste raio ou cidade. Tente ampliar o raio ou selecionar outra cidade de {estadoSelecionado}.
							</p>
							<button
								type="button"
								onclick={handleLimparFiltros}
								class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
							>
								<RotateCcw class="w-3.5 h-3.5" />
								<span>Redefinir Filtros</span>
							</button>
						</div>
					{:else}
						<div class="space-y-3.5 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
							{#each postosExibidos as posto (posto.id)}
								<PostoCard
									{posto}
									selecionado={postoSelecionado?.id === posto.id}
									onSelecionar={handleAbrirDetalhes}
									onFocarNoMapa={handleFocarNoMapa}
								/>
							{/each}

							{#if postos.length > itensExibidos}
								<div class="pt-2 pb-4 text-center">
									<button
										type="button"
										onclick={() => (itensExibidos += 30)}
										class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-blue-400 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
									>
										<span>Mostrar mais 30 postos ({postosExibidos.length} de {postos.length})</span>
									</button>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Coluna da Direita: Mapa Interativo Fixo -->
				<div class="lg:col-span-6 xl:col-span-7 h-[450px] lg:h-[calc(100vh-210px)] sticky top-24 {modoMobile === 'lista' ? 'hidden lg:block' : 'block'}">
					<MapaPostos
						{postos}
						{postoSelecionado}
						centro={centroMapa}
						zoom={zoomMapa}
						{localizacaoUsuario}
						{pontoReferencia}
						{raioKm}
						onSelecionarPosto={handleSelecionarPosto}
						onDetalhesPosto={handleAbrirDetalhes}
					/>
				</div>
			</div>

		<!-- 2. MODO LISTA COMPLETA (Grid Multicolunas) -->
		{:else if modoVisualizacao === 'lista'}
			{#if carregandoPostos}
				<div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
					<Loader2 class="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
					<h3 class="text-sm font-bold text-slate-800">Carregando postos...</h3>
				</div>
			{:else if postos.length === 0}
				<div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-12">
					<SearchX class="w-12 h-12 text-slate-300 mx-auto mb-3" />
					<h3 class="text-base font-bold text-slate-800">Nenhum posto encontrado</h3>
					<p class="text-xs text-slate-500 mt-1 mb-4">
						Nenhum posto corresponde aos critérios informados. Experimente limpar os filtros.
					</p>
					<button
						type="button"
						onclick={handleLimparFiltros}
						class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
					>
						<RotateCcw class="w-3.5 h-3.5" />
						<span>Limpar Filtros</span>
					</button>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each postosExibidos as posto (posto.id)}
						<PostoCard
							{posto}
							selecionado={postoSelecionado?.id === posto.id}
							onSelecionar={handleAbrirDetalhes}
							onFocarNoMapa={handleFocarNoMapa}
						/>
					{/each}
				</div>

				{#if postos.length > itensExibidos}
					<div class="pt-4 pb-8 text-center max-w-sm mx-auto">
						<button
							type="button"
							onclick={() => (itensExibidos += 30)}
							class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-blue-400 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
						>
							<span>Mostrar mais 30 postos ({postosExibidos.length} de {postos.length})</span>
						</button>
					</div>
				{/if}
			{/if}

		<!-- 3. MODO MAPA EM TELA CHEIA COM CARD FLUTUANTE -->
		{:else if modoVisualizacao === 'mapa'}
			<div class="relative w-full h-[calc(100vh-210px)] min-h-[500px]">
				<MapaPostos
					{postos}
					{postoSelecionado}
					centro={centroMapa}
					zoom={zoomMapa}
					{localizacaoUsuario}
					{pontoReferencia}
					{raioKm}
					onSelecionarPosto={handleSelecionarPosto}
					onDetalhesPosto={handleAbrirDetalhes}
				/>

				<!-- Card Flutuante com Resumo do Posto Selecionado no Mapa -->
				{#if postoSelecionado}
					<div class="absolute bottom-6 right-6 left-6 sm:left-auto sm:w-96 z-30 animate-in slide-in-from-bottom-4 duration-200">
						<PostoCard
							posto={postoSelecionado}
							selecionado={true}
							onSelecionar={handleAbrirDetalhes}
							onFocarNoMapa={handleFocarNoMapa}
						/>
					</div>
				{/if}
			</div>
		{/if}
	</main>

	<!-- Modais Globais -->
	<PostoDetalhesModal
		posto={postoModalDetalhes}
		onClose={() => (postoModalDetalhes = null)}
		onAbrirCalculadora={() => (modalCalculadoraAberto = true)}
	/>

	<CalculadoraModal
		aberto={modalCalculadoraAberto}
		precoGasolinaInicial={postoModalDetalhes?.precos.gasolinaComum ?? 5.89}
		precoEtanolInicial={postoModalDetalhes?.precos.etanol ?? 3.99}
		onClose={() => (modalCalculadoraAberto = false)}
	/>

	<GuiaANPModal
		aberto={modalGuiaANPAberto}
		onClose={() => (modalGuiaANPAberto = false)}
	/>

	<BaseDadosModal
		aberto={modalBaseDadosAberto}
		estadoAtual={estadoSelecionado}
		totalPostosEstado={postosDaCidade.length}
		onClose={() => (modalBaseDadosAberto = false)}
		onCsvAtualizado={handleCsvAtualizado}
	/>

	<!-- Rodapé -->
	<footer class="bg-white border-t border-slate-200/80 py-6 mt-auto text-xs text-slate-500">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<div class="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
					<Fuel class="w-3.5 h-3.5" />
				</div>
				<span class="font-bold text-slate-800">PostoRadar Brasil</span>
				<span>— Dados públicos orientados ao consumidor e motoristas.</span>
			</div>

			<div class="flex items-center gap-4 text-[11px]">
				<button
					type="button"
					onclick={() => (modalBaseDadosAberto = true)}
					class="hover:text-blue-600 transition-colors cursor-pointer font-bold text-blue-700"
				>
					Base de Dados ANP (CSV)
				</button>
				<span>•</span>
				<button
					type="button"
					onclick={() => (modalGuiaANPAberto = true)}
					class="hover:text-blue-600 transition-colors cursor-pointer"
				>
					Guia de Fiscalização ANP
				</button>
				<span>•</span>
				<button
					type="button"
					onclick={() => (modalCalculadoraAberto = true)}
					class="hover:text-blue-600 transition-colors cursor-pointer"
				>
					Calculadora Etanol vs Gasolina
				</button>
				<span>•</span>
				<a
					href="https://anpcomvcpostos.anp.gov.br"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-blue-600 transition-colors"
				>
					Portal Oficial ANP Com Você
				</a>
			</div>
		</div>
	</footer>
</div>
