<script lang="ts">
	import {
		Fuel,
		Zap,
		MapPin,
		ShieldCheck,
		ShieldAlert,
		ShieldX,
		ShieldQuestion,
		Clock,
		Store,
		Wrench,
		ExternalLink,
		Navigation,
		Sparkles,
		Eye,
		Gauge,
		Layers
	} from '@lucide/svelte';
	import type { PostoCombustivel } from '#lib/types';
	import {
		formatarPreco,
		formatarPrecoKwh,
		formatarCNPJ,
		getInfoBandeira,
		calcularParidadeEtanolGasolina
	} from '#lib/utils/formatters';
	import { getInfoFiscalizacao } from '#lib/utils/anp';
	import { formatarDistancia } from '#lib/utils/geo';

	interface Props {
		posto: PostoCombustivel;
		selecionado?: boolean;
		onSelecionar: (posto: PostoCombustivel) => void;
		onFocarNoMapa: (posto: PostoCombustivel) => void;
	}

	let {
		posto,
		selecionado = false,
		onSelecionar,
		onFocarNoMapa
	}: Props = $props();

	const infoBandeira = $derived(getInfoBandeira(posto.bandeira, posto.bandeiraBranca));
	const infoFiscalizacao = $derived(getInfoFiscalizacao(posto.fiscalizacao.statusFiscalizacao));
	const paridade = $derived(
		calcularParidadeEtanolGasolina(posto.precos.etanol, posto.precos.gasolinaComum)
	);

	function abrirRotaGoogleMaps(e: MouseEvent) {
		e.stopPropagation();
		const { lat, lng } = posto.coordenadas;
		const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
		window.open(url, '_blank');
	}

	function abrirANPComVc(e: MouseEvent) {
		e.stopPropagation();
		window.open(posto.fiscalizacao.anpComVcUrl, '_blank');
	}
</script>

<div
	role="button"
	tabindex="0"
	onclick={() => onSelecionar(posto)}
	onkeydown={(e) => e.key === 'Enter' && onSelecionar(posto)}
	class="bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative text-left group {selecionado ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/20' : 'border-slate-200/80 hover:border-blue-200'}"
>
	<!-- Topo do Card: Bandeira e Distância -->
	<div class="flex items-start justify-between gap-3 mb-3">
		<div class="flex items-center gap-2 flex-wrap">
			<!-- Badge da Bandeira / Marca -->
			<span
				class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border {infoBandeira.corFundo} {infoBandeira.corTexto} {infoBandeira.corBorda}"
			>
				<span class="w-2 h-2 rounded-full" style="background-color: {infoBandeira.corHex};"></span>
				{infoBandeira.nome}
			</span>

			<!-- Selo Bandeira Branca explicativo se aplicável -->
			{#if posto.bandeiraBranca}
				<span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200" title="Posto independente sem vínculo de exclusividade com distribuidora">
					Independente
				</span>
			{/if}

			<!-- Badge de Fiscalização ANP -->
			<button
				type="button"
				onclick={abrirANPComVc}
				title="Verificar registro no portal oficial da ANP ({posto.fiscalizacao.statusFiscalizacao})"
				class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-colors {infoFiscalizacao.corBadge} hover:opacity-90"
			>
				{#if posto.fiscalizacao.statusFiscalizacao === 'REGULAR'}
					<ShieldCheck class="w-3.5 h-3.5" />
				{:else if posto.fiscalizacao.statusFiscalizacao === 'NOTIFICADO'}
					<ShieldAlert class="w-3.5 h-3.5" />
				{:else if posto.fiscalizacao.statusFiscalizacao === 'INTERDITADO'}
					<ShieldX class="w-3.5 h-3.5" />
				{:else}
					<ShieldQuestion class="w-3.5 h-3.5" />
				{/if}
				<span>ANP: {infoFiscalizacao.titulo}</span>
			</button>
		</div>

		<!-- Distância do usuário (se calculada) -->
		{#if posto.distanciaKm !== undefined}
			<span class="shrink-0 px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
				<MapPin class="w-3 h-3 text-blue-600" />
				{formatarDistancia(posto.distanciaKm)}
			</span>
		{/if}
	</div>

	<!-- Nome do Posto e Endereço -->
	<div class="mb-4">
		<h3 class="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
			{posto.nome}
		</h3>
		<p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
			<MapPin class="w-3.5 h-3.5 shrink-0 text-slate-400" />
			<span class="truncate">{posto.endereco.logradouro}, {posto.endereco.numero || 's/n'} • {posto.endereco.bairro}, {posto.endereco.municipio} - {posto.endereco.uf}</span>
		</p>
	</div>

	<!-- Seção de Combustíveis e Preços -->
	<div class="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3.5">
		<div class="flex items-center justify-between mb-2">
			<span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
				<Fuel class="w-3.5 h-3.5 text-blue-600" />
				Combustíveis Praticados
			</span>
			{#if posto.precos.dataAtualizacao}
				<span class="text-[10px] text-slate-400">
					Atualizado {new Date(posto.precos.dataAtualizacao).toLocaleDateString('pt-BR')}
				</span>
			{/if}
		</div>

		{#if posto.completudeDados.precos}
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<!-- Gasolina Comum -->
				<div class="bg-white rounded-lg p-2 border border-slate-200/70">
					<span class="block text-[10px] font-medium text-slate-500 truncate">Gasolina Comum</span>
					<span class="block text-sm font-extrabold text-slate-900">
						{formatarPreco(posto.precos.gasolinaComum)}
					</span>
				</div>

				<!-- Etanol -->
				<div class="bg-white rounded-lg p-2 border border-slate-200/70">
					<span class="block text-[10px] font-medium text-slate-500 truncate">Etanol</span>
					<span class="block text-sm font-extrabold text-emerald-700">
						{formatarPreco(posto.precos.etanol)}
					</span>
				</div>

				<!-- Diesel S10 -->
				<div class="bg-white rounded-lg p-2 border border-slate-200/70">
					<span class="block text-[10px] font-medium text-slate-500 truncate">Diesel S10</span>
					<span class="block text-sm font-extrabold text-slate-900">
						{formatarPreco(posto.precos.dieselS10)}
					</span>
				</div>

				<!-- GNV -->
				<div class="bg-white rounded-lg p-2 border border-slate-200/70">
					<span class="block text-[10px] font-medium text-slate-500 truncate">GNV</span>
					<span class="block text-sm font-extrabold text-slate-900">
						{formatarPreco(posto.precos.gnv)}
					</span>
				</div>
			</div>

			<!-- Relação Etanol x Gasolina (Paridade 70%) -->
			{#if paridade}
				<div class="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
					<span class="text-slate-600 font-medium">
						Paridade Etanol: <strong class="{paridade.recomendacao === 'etanol' ? 'text-emerald-600' : 'text-amber-600'}">{paridade.razao}%</strong>
					</span>
					<span class="font-bold {paridade.recomendacao === 'etanol' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md' : 'text-slate-600'}">
						{paridade.recomendacao === 'etanol' ? '🍃 Compensa Etanol' : '⛽ Compensa Gasolina'}
					</span>
				</div>
			{/if}
		{:else}
			<div class="py-2 px-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-center">
				<p class="text-xs text-amber-800 font-medium">Preços não informados na base online recente.</p>
				<p class="text-[11px] text-amber-600/90 mt-0.5">Posto ativo no cadastro ANP. Consulte valores no totem presencial.</p>
			</div>
		{/if}
	</div>

	<!-- Bloco de Eletroposto (se houver) -->
	{#if posto.eletroposto.temEletroposto}
		<div class="mb-3.5 bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white rounded-xl p-3 border border-amber-200/70">
			<div class="flex items-center justify-between mb-1.5">
				<div class="flex items-center gap-1.5">
					<div class="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
						<Zap class="w-3.5 h-3.5 fill-white" />
					</div>
					<div>
						<span class="text-xs font-bold text-amber-950 block">Estação de Carregamento Elétrico</span>
						<span class="text-[10px] text-amber-700">{posto.eletroposto.redeOperadora || 'Rede de Recarga'}</span>
					</div>
				</div>

				<span class="text-xs font-extrabold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md">
					{formatarPrecoKwh(posto.eletroposto.precoKwh, posto.eletroposto.tarifaGratuita)}
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-1.5 mt-2">
				<span class="px-2 py-0.5 text-[10px] font-semibold bg-white text-slate-700 rounded-md border border-amber-200/80">
					{posto.eletroposto.qtdEstacoes ?? 1} {posto.eletroposto.qtdEstacoes === 1 ? 'vaga' : 'vagas'}
				</span>
				{#if posto.eletroposto.potenciaMaxKw}
					<span class="px-2 py-0.5 text-[10px] font-semibold bg-white text-slate-700 rounded-md border border-amber-200/80">
						Até {posto.eletroposto.potenciaMaxKw} kW
					</span>
				{/if}
				{#each posto.eletroposto.conectores || [] as conector}
					<span class="px-2 py-0.5 text-[10px] font-semibold bg-amber-100/80 text-amber-900 rounded-md">
						{conector.tipo}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Serviços e Comodidades -->
	<div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
		<div class="flex items-center gap-3">
			{#if posto.servicos.conveniencia}
				<span class="inline-flex items-center gap-1 text-slate-700 font-medium" title={posto.servicos.nomeConveniencia || 'Loja de Conveniência'}>
					<Store class="w-3.5 h-3.5 text-indigo-600" />
					<span class="text-[11px]">{posto.servicos.nomeConveniencia || 'Conveniência'}</span>
				</span>
			{/if}
			{#if posto.servicos.calibrador}
				<span class="inline-flex items-center gap-1 text-slate-600" title="Calibrador de pneus gratuito">
					<Gauge class="w-3.5 h-3.5 text-blue-500" />
					<span class="text-[11px] hidden sm:inline">Calibrador</span>
				</span>
			{/if}
			{#if posto.servicos.trocaOleo}
				<span class="inline-flex items-center gap-1 text-slate-600" title="Troca de óleo / Lubrificantes">
					<Wrench class="w-3.5 h-3.5 text-amber-600" />
					<span class="text-[11px] hidden sm:inline">Óleo</span>
				</span>
			{/if}
			{#if posto.servicos.aberto24h}
				<span class="inline-flex items-center gap-1 text-slate-600" title="Aberto 24 horas">
					<Clock class="w-3.5 h-3.5 text-emerald-600" />
					<span class="text-[11px]">24h</span>
				</span>
			{/if}
		</div>

		<!-- Botões de Ação Rápida -->
		<div class="flex items-center gap-1.5 ml-auto">
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					onFocarNoMapa(posto);
				}}
				class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
				title="Ver este posto no mapa"
				aria-label="Ver no mapa"
			>
				<MapPin class="w-4 h-4" />
			</button>
			<button
				type="button"
				onclick={abrirRotaGoogleMaps}
				class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
				title="Traçar rota no GPS"
				aria-label="Traçar rota"
			>
				<Navigation class="w-4 h-4" />
			</button>
			<button
				type="button"
				onclick={() => onSelecionar(posto)}
				class="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white rounded-lg transition-all flex items-center gap-1"
			>
				<Eye class="w-3 h-3" />
				<span>Detalhes</span>
			</button>
		</div>
	</div>
</div>
