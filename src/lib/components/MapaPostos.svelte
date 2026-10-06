<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PostoCombustivel } from '#lib/types';
	import { formatarPreco, formatarPrecoKwh, getInfoBandeira } from '#lib/utils/formatters';
	import { getInfoFiscalizacao } from '#lib/utils/anp';

	interface Props {
		postos: PostoCombustivel[];
		postoSelecionado?: PostoCombustivel | null;
		centro?: { lat: number; lng: number };
		zoom?: number;
		localizacaoUsuario?: { lat: number; lng: number } | null;
		pontoReferencia?: { lat: number; lng: number } | null;
		raioKm?: number | null;
		onSelecionarPosto: (posto: PostoCombustivel) => void;
		onDetalhesPosto: (posto: PostoCombustivel) => void;
	}

	let {
		postos,
		postoSelecionado = null,
		centro = { lat: -23.55052, lng: -46.633308 }, // São Paulo default
		zoom = 13,
		localizacaoUsuario = null,
		pontoReferencia = null,
		raioKm = null,
		onSelecionarPosto,
		onDetalhesPosto
	}: Props = $props();

	let mapContainer: HTMLDivElement | null = $state(null);
	let mapInstance: any = null;
	let L: any = null;
	let markersLayer: any = null;
	let userMarker: any = null;
	let markersMap = new Map<string, any>();

	function getCorBandeira(bandeira: string, bandeiraBranca?: boolean): string {
		if (bandeiraBranca) return '#64748b'; // Slate
		switch (bandeira) {
			case 'VIBRA':
				return '#059669'; // Emerald
			case 'IPIRANGA':
				return '#2563eb'; // Blue / Amber combo
			case 'RAIZEN':
				return '#e11d48'; // Rose / Shell Red
			case 'ALE':
				return '#ea580c'; // Orange
			case 'RODOIL':
				return '#16a34a'; // Green
			case 'DISLUB':
				return '#0284c7'; // Sky
			default:
				return '#475569';
		}
	}

	function criarHtmlIcone(posto: PostoCombustivel, isSelecionado: boolean): string {
		const cor = getCorBandeira(posto.bandeira, posto.bandeiraBranca);
		const temEV = posto.eletroposto?.temEletroposto;
		const precoPrincipal = posto.precos.gasolinaComum
			? `R$ ${posto.precos.gasolinaComum.toFixed(2)}`
			: (posto.precos.etanol ? `R$ ${posto.precos.etanol.toFixed(2)}` : '');

		const escala = isSelecionado ? 'transform: scale(1.18); z-index: 1000;' : '';

		return `
			<div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-200" style="${escala}">
				<!-- Badge de preço flutuante -->
				${precoPrincipal ? `
					<div class="mb-1 px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-tight shadow-md whitespace-nowrap bg-white text-slate-900 border border-slate-200">
						${precoPrincipal}
					</div>
				` : ''}

				<!-- Pin Principal -->
				<div class="relative w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transition-transform" style="background-color: ${cor}; border: 2.5px solid #ffffff;">
					<!-- Ícone interior -->
					${temEV ? `
						<svg class="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
							<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
						</svg>
					` : `
						<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"></path>
							<path d="M15 10h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4"></path>
							<path d="M6 7h6"></path>
						</svg>
					`}

					<!-- Badge de raio (EV) se tiver eletroposto e for posto tradicional -->
					${temEV ? `
						<span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-white flex items-center justify-center text-[8px] font-black text-amber-950 shadow-xs">
							⚡
						</span>
					` : ''}
				</div>

				<!-- Ponta do pin -->
				<div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] shadow-xs" style="border-t-color: ${cor}; margin-top: -1px;"></div>
			</div>
		`;
	}

	function criarHtmlPopup(posto: PostoCombustivel): string {
		const infoBandeira = getInfoBandeira(posto.bandeira, posto.bandeiraBranca);
		const infoFiscalizacao = getInfoFiscalizacao(posto.fiscalizacao.statusFiscalizacao);
		
		const precoGasolina = posto.precos.gasolinaComum ? `R$ ${posto.precos.gasolinaComum.toFixed(2)}` : 'Não inf.';
		const precoEtanol = posto.precos.etanol ? `R$ ${posto.precos.etanol.toFixed(2)}` : 'Não inf.';
		const precoDiesel = posto.precos.dieselS10 ? `R$ ${posto.precos.dieselS10.toFixed(2)}` : 'Não inf.';

		return `
			<div class="p-3.5 max-w-[280px] font-sans">
				<div class="flex items-center justify-between gap-2 mb-1.5">
					<span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${infoBandeira.corFundo} ${infoBandeira.corTexto}">
						${infoBandeira.nome}
					</span>
					<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${infoFiscalizacao.corBadge}">
						ANP: ${infoFiscalizacao.titulo}
					</span>
				</div>

				<h4 class="font-bold text-sm text-slate-900 leading-tight mb-1">
					${posto.nome}
				</h4>
				<p class="text-[11px] text-slate-500 mb-2 leading-tight">
					${posto.endereco.logradouro}, ${posto.endereco.numero || 's/n'} - ${posto.endereco.bairro}
				</p>

				<!-- Grid de Preços -->
				<div class="grid grid-cols-3 gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center mb-2.5">
					<div>
						<span class="block text-[9px] text-slate-400 font-medium">Gasolina</span>
						<span class="block text-xs font-bold text-slate-800">${precoGasolina}</span>
					</div>
					<div>
						<span class="block text-[9px] text-slate-400 font-medium">Etanol</span>
						<span class="block text-xs font-bold text-emerald-700">${precoEtanol}</span>
					</div>
					<div>
						<span class="block text-[9px] text-slate-400 font-medium">Diesel S10</span>
						<span class="block text-xs font-bold text-slate-800">${precoDiesel}</span>
					</div>
				</div>

				<!-- Eletroposto info se presente -->
				${posto.eletroposto?.temEletroposto ? `
					<div class="flex items-center justify-between bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60 mb-2 text-[10px] text-amber-900 font-semibold">
						<span class="flex items-center gap-1">⚡ Eletroposto (${posto.eletroposto.potenciaMaxKw || 50} kW)</span>
						<span>${formatarPrecoKwh(posto.eletroposto.precoKwh, posto.eletroposto.tarifaGratuita)}</span>
					</div>
				` : ''}

				<!-- Botão de Ação -->
				<button
					id="btn-detalhes-${posto.id}"
					class="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center block"
				>
					Ver Ficha Completa
				</button>
			</div>
		`;
	}

	function renderizarMarcadores() {
		if (!mapInstance || !L || !markersLayer) return;

		markersLayer.clearLayers();
		markersMap.clear();

		postos.forEach((posto) => {
			const isSelecionado = postoSelecionado?.id === posto.id;
			const icon = L.divIcon({
				html: criarHtmlIcone(posto, isSelecionado),
				className: 'custom-posto-marker',
				iconSize: [44, 48],
				iconAnchor: [22, 48],
				popupAnchor: [0, -48]
			});

			const marker = L.marker([posto.coordenadas.lat, posto.coordenadas.lng], { icon });

			marker.bindPopup(criarHtmlPopup(posto), {
				maxWidth: 300,
				className: 'posto-popup'
			});

			marker.on('click', () => {
				onSelecionarPosto(posto);
			});

			marker.on('popupopen', () => {
				const btn = document.getElementById(`btn-detalhes-${posto.id}`);
				if (btn) {
					btn.onclick = () => onDetalhesPosto(posto);
				}
			});

			markersLayer.addLayer(marker);
			markersMap.set(posto.id, marker);
		});
	}

	function atualizarMarcadorUsuario() {
		if (!mapInstance || !L) return;

		if (userMarker) {
			mapInstance.removeLayer(userMarker);
			userMarker = null;
		}

		if (localizacaoUsuario) {
			const userIcon = L.divIcon({
				html: '<div class="user-location-marker"></div>',
				className: 'user-marker-container',
				iconSize: [20, 20],
				iconAnchor: [10, 10]
			});

			userMarker = L.marker([localizacaoUsuario.lat, localizacaoUsuario.lng], {
				icon: userIcon,
				zIndexOffset: 1500
			}).addTo(mapInstance);

			userMarker.bindPopup(
				'<div class="p-2 text-xs font-bold text-slate-800">Você está aqui</div>'
			);
		}
	}

	// Efeitos reativos
	$effect(() => {
		// Atualiza marcadores quando a lista de postos ou seleção mudar
		if (postos && mapInstance) {
			renderizarMarcadores();
		}
	});

	$effect(() => {
		// Centraliza o mapa se a prop centro mudar
		if (centro && mapInstance) {
			mapInstance.setView([centro.lat, centro.lng], zoom, { animate: true });
		}
	});

	$effect(() => {
		// Abre o popup e foca no posto selecionado
		if (postoSelecionado && mapInstance) {
			const marker = markersMap.get(postoSelecionado.id);
			if (marker) {
				mapInstance.flyTo(
					[postoSelecionado.coordenadas.lat, postoSelecionado.coordenadas.lng],
					Math.max(mapInstance.getZoom(), 15),
					{ duration: 0.8 }
				);
				marker.openPopup();
			}
		}
	});

	let circleLayer: any = null;
	let refMarker: any = null;

	function atualizarCirculoRaio() {
		if (!mapInstance || !L) return;

		if (circleLayer) {
			mapInstance.removeLayer(circleLayer);
			circleLayer = null;
		}

		if (refMarker) {
			mapInstance.removeLayer(refMarker);
			refMarker = null;
		}

		if (pontoReferencia) {
			// Marcador de referência do endereço pesquisado
			const refIcon = L.divIcon({
				html: `
					<div class="relative flex items-center justify-center">
						<div class="absolute w-7 h-7 rounded-full bg-blue-500/25 animate-ping"></div>
						<div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
							<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="3"></circle>
								<path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
							</svg>
						</div>
					</div>
				`,
				className: 'ref-point-marker',
				iconSize: [28, 28],
				iconAnchor: [14, 14]
			});

			refMarker = L.marker([pontoReferencia.lat, pontoReferencia.lng], {
				icon: refIcon,
				zIndexOffset: 2000
			}).addTo(mapInstance);

			refMarker.bindPopup('<div class="p-1.5 text-xs font-bold text-blue-900">Ponto de Referência</div>');

			// Desenha o círculo de raio se definido
			if (raioKm && raioKm > 0) {
				circleLayer = L.circle([pontoReferencia.lat, pontoReferencia.lng], {
					radius: raioKm * 1000, // metros
					color: '#2563eb',
					fillColor: '#3b82f6',
					fillOpacity: 0.10,
					weight: 2,
					dashArray: '6, 6'
				}).addTo(mapInstance);
			}
		}
	}

	$effect(() => {
		// Atualiza círculo de raio e ponto de referência
		if (mapInstance) {
			// Leitura reativa dos estados
			const _p = pontoReferencia;
			const _r = raioKm;
			atualizarCirculoRaio();
		}
	});

	onMount(async () => {
		if (typeof window === 'undefined' || !mapContainer) return;

		L = await import('leaflet');

		mapInstance = L.map(mapContainer, {
			center: [centro.lat, centro.lng],
			zoom: zoom,
			zoomControl: false
		});

		// Adiciona controle de zoom no canto superior direito
		L.control.zoom({ position: 'topright' }).addTo(mapInstance);

		// Camadas de mapa 100% livres e gratuitas (não requerem nenhuma chave de API)
		const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		});

		const esriStreetLayer = L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
			{
				attribution:
					'&copy; <a href="https://www.esri.com/">Esri</a> &mdash; DeLorme, NAVTEQ, TomTom',
				maxZoom: 19
			}
		);

		const esriSatLayer = L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			{
				attribution:
					'&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
				maxZoom: 19
			}
		);

		// Adiciona OpenStreetMap como camada ativa padrão
		osmLayer.addTo(mapInstance);

		// Controle seletor de camadas no canto superior direito
		L.control.layers(
			{
				'OpenStreetMap (Padrão)': osmLayer,
				'Ruas Detalhadas (Esri)': esriStreetLayer,
				'Satélite (Esri)': esriSatLayer
			},
			undefined,
			{ position: 'topright' }
		).addTo(mapInstance);

		markersLayer = L.layerGroup().addTo(mapInstance);

		renderizarMarcadores();
		atualizarMarcadorUsuario();
	});

	onDestroy(() => {
		if (mapInstance) {
			mapInstance.remove();
			mapInstance = null;
		}
	});
</script>

<div class="relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-slate-100">
	<div bind:this={mapContainer} class="w-full h-full z-10"></div>

	<!-- Legenda Compacta Flutuante no Rodapé do Mapa -->
	<div class="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] flex items-center gap-3.5 flex-wrap pointer-events-auto">
		<div class="flex items-center gap-1.5 font-medium text-slate-700">
			<span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
			<span>Vibra</span>
		</div>
		<div class="flex items-center gap-1.5 font-medium text-slate-700">
			<span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
			<span>Ipiranga</span>
		</div>
		<div class="flex items-center gap-1.5 font-medium text-slate-700">
			<span class="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
			<span>Shell</span>
		</div>
		<div class="flex items-center gap-1.5 font-medium text-slate-700">
			<span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
			<span>Bandeira Branca</span>
		</div>
		<div class="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
			<span>⚡ Eletroposto EV</span>
		</div>
	</div>
</div>
