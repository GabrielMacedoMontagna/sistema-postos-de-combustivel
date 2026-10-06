<script lang="ts">
	import {
		X,
		MapPin,
		Fuel,
		Zap,
		ShieldCheck,
		ShieldAlert,
		ShieldX,
		ShieldQuestion,
		Clock,
		Store,
		Wrench,
		ExternalLink,
		Navigation,
		CheckCircle2,
		AlertTriangle,
		Copy,
		Sparkles,
		BadgeCheck,
		Car,
		CreditCard,
		HelpCircle
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

	interface Props {
		posto: PostoCombustivel | null;
		onClose: () => void;
		onAbrirCalculadora?: () => void;
	}

	let { posto, onClose, onAbrirCalculadora }: Props = $props();

	let copiado = $state(false);

	const infoBandeira = $derived(
		posto ? getInfoBandeira(posto.bandeira, posto.bandeiraBranca) : null
	);
	const infoFiscalizacao = $derived(
		posto ? getInfoFiscalizacao(posto.fiscalizacao.statusFiscalizacao) : null
	);
	const paridade = $derived(
		posto
			? calcularParidadeEtanolGasolina(posto.precos.etanol, posto.precos.gasolinaComum)
			: null
	);

	function copiarEndereco() {
		if (!posto) return;
		const texto = `${posto.nome} - ${posto.endereco.logradouro}, ${posto.endereco.numero || 's/n'} - ${posto.endereco.bairro}, ${posto.endereco.municipio}/${posto.endereco.uf} - CEP ${posto.endereco.cep}`;
		navigator.clipboard.writeText(texto);
		copiado = true;
		setTimeout(() => {
			copiado = false;
		}, 2000);
	}

	function abrirRotaGoogleMaps() {
		if (!posto) return;
		const { lat, lng } = posto.coordenadas;
		window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
	}

	function abrirRotaWaze() {
		if (!posto) return;
		const { lat, lng } = posto.coordenadas;
		window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if posto && infoBandeira && infoFiscalizacao}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-posto-titulo"
	>
		<!-- Container do Modal -->
		<div
			class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
		>
			<!-- Cabeçalho com cor da bandeira -->
			<div class="relative px-6 py-5 border-b border-slate-200 bg-slate-50/80">
				<!-- Botão Fechar -->
				<button
					type="button"
					onclick={onClose}
					class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
					aria-label="Fechar janela"
				>
					<X class="w-5 h-5" />
				</button>

				<!-- Badges de topo -->
				<div class="flex items-center gap-2 flex-wrap mb-2.5">
					<span
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border {infoBandeira.corFundo} {infoBandeira.corTexto} {infoBandeira.corBorda}"
					>
						<span class="w-2.5 h-2.5 rounded-full" style="background-color: {infoBandeira.corHex};"></span>
						{infoBandeira.nome}
					</span>

					{#if posto.bandeiraBranca}
						<span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
							Bandeira Branca (Independente)
						</span>
					{/if}

					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border {infoFiscalizacao.corBadge}">
						{#if posto.fiscalizacao.statusFiscalizacao === 'REGULAR'}
							<ShieldCheck class="w-4 h-4" />
						{:else if posto.fiscalizacao.statusFiscalizacao === 'NOTIFICADO'}
							<ShieldAlert class="w-4 h-4" />
						{:else}
							<ShieldX class="w-4 h-4" />
						{/if}
						<span>ANP: {infoFiscalizacao.titulo}</span>
					</span>

					{#if posto.eletroposto.temEletroposto}
						<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
							<Zap class="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
							Eletroposto EV
						</span>
					{/if}
				</div>

				<!-- Título e Razão Social -->
				<h2 id="modal-posto-titulo" class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
					{posto.nome}
				</h2>
				{#if posto.razaoSocial}
					<p class="text-xs text-slate-500 mt-0.5">
						Razão Social: <span class="font-medium text-slate-700">{posto.razaoSocial}</span>
					</p>
				{/if}
			</div>

			<!-- Conteúdo com Scroll -->
			<div class="overflow-y-auto p-6 space-y-6 flex-1">
				
				<!-- Seção 1: Dados Cadastrais e Registro ANP -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
					<div>
						<span class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">CNPJ</span>
						<span class="block text-xs font-bold text-slate-800 mt-0.5">{formatarCNPJ(posto.cnpj)}</span>
					</div>
					<div>
						<span class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Cód. SIMP ANP</span>
						<span class="block text-xs font-bold text-slate-800 mt-0.5">{posto.fiscalizacao.codigoSimp || 'N/D'}</span>
					</div>
					<div>
						<span class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Autorização</span>
						<span class="block text-xs font-bold text-slate-800 mt-0.5">{posto.fiscalizacao.numeroAutorizacao || 'Ativa'}</span>
					</div>
					<div>
						<span class="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Data Vínculo</span>
						<span class="block text-xs font-bold text-slate-800 mt-0.5">
							{posto.fiscalizacao.dataVinculacaoBandeira
								? new Date(posto.fiscalizacao.dataVinculacaoBandeira).toLocaleDateString('pt-BR')
								: 'N/D'}
						</span>
					</div>
				</div>

				<!-- Seção 2: Conformidade e Fiscalização da Qualidade ANP -->
				<div class="border rounded-2xl p-4 sm:p-5 {posto.fiscalizacao.statusFiscalizacao === 'REGULAR' ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/40'}">
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-xl flex items-center justify-center {posto.fiscalizacao.statusFiscalizacao === 'REGULAR' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}">
								<ShieldCheck class="w-5 h-5" />
							</div>
							<div>
								<h3 class="font-bold text-sm sm:text-base text-slate-900">
									Inspeção de Qualidade & Registro Oficial ANP
								</h3>
								<p class="text-xs text-slate-500">
									Agência Nacional do Petróleo, Gás Natural e Biocombustíveis
								</p>
							</div>
						</div>

						<a
							href={posto.fiscalizacao.anpComVcUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs transition-colors shrink-0"
						>
							<span>Consultar no ANP Com Você</span>
							<ExternalLink class="w-3.5 h-3.5 text-blue-600" />
						</a>
					</div>

					<p class="text-xs text-slate-700 leading-relaxed mb-4">
						{infoFiscalizacao.descricao}
					</p>

					<!-- Checklist de Verificações Oficiais -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
						<div class="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
							<div>
								<span class="font-bold text-slate-800">Mistura Legal de Etanol na Gasolina:</span>
								<span class="text-slate-600 ml-1">Conforme especificação federal (27% anidro).</span>
							</div>
						</div>

						<div class="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
							<div>
								<span class="font-bold text-slate-800">Bomba Medidora (20 Litros):</span>
								<span class="text-slate-600 ml-1">Lacrada com selo do INMETRO dentro da tolerância de ±100ml.</span>
							</div>
						</div>

						<div class="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
							<div>
								<span class="font-bold text-slate-800">Termodensímetro no Etanol:</span>
								<span class="text-slate-600 ml-1">Equipamento transparente em operação na bomba.</span>
							</div>
						</div>

						<div class="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
							<div>
								<span class="font-bold text-slate-800">Direito ao Teste da Proveta:</span>
								<span class="text-slate-600 ml-1">O consumidor pode exigir o teste no local sem custos.</span>
							</div>
						</div>
					</div>

					{#if posto.fiscalizacao.observacoes}
						<div class="mt-3 p-2.5 rounded-xl bg-amber-100/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
							<AlertTriangle class="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
							<span><strong>Nota de fiscalização:</strong> {posto.fiscalizacao.observacoes}</span>
						</div>
					{/if}
				</div>

				<!-- Seção 3: Preços Detalhados e Paridade -->
				<div>
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
							<Fuel class="w-4 h-4 text-blue-600" />
							Preços de Combustíveis Praticados
						</h3>
						{#if posto.precos.dataAtualizacao}
							<span class="text-xs text-slate-400">
								Última coleta: {new Date(posto.precos.dataAtualizacao).toLocaleDateString('pt-BR')}
							</span>
						{/if}
					</div>

					{#if posto.completudeDados.precos}
						<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3.5">
							<div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
								<span class="text-xs text-slate-500 font-medium">Gasolina Comum</span>
								<span class="block text-lg font-black text-slate-900 mt-0.5">
									{formatarPreco(posto.precos.gasolinaComum)}
								</span>
							</div>

							<div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
								<span class="text-xs text-slate-500 font-medium">Gasolina Aditivada</span>
								<span class="block text-lg font-black text-slate-900 mt-0.5">
									{formatarPreco(posto.precos.gasolinaAditivada)}
								</span>
							</div>

							<div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
								<span class="text-xs text-emerald-800 font-medium">Etanol Hidratado</span>
								<span class="block text-lg font-black text-emerald-700 mt-0.5">
									{formatarPreco(posto.precos.etanol)}
								</span>
							</div>

							<div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
								<span class="text-xs text-slate-500 font-medium">Diesel S10</span>
								<span class="block text-lg font-black text-slate-900 mt-0.5">
									{formatarPreco(posto.precos.dieselS10)}
								</span>
							</div>

							<div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
								<span class="text-xs text-slate-500 font-medium">Diesel Comum</span>
								<span class="block text-lg font-black text-slate-900 mt-0.5">
									{formatarPreco(posto.precos.dieselComum)}
								</span>
							</div>

							<div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
								<span class="text-xs text-slate-500 font-medium">GNV (m³)</span>
								<span class="block text-lg font-black text-slate-900 mt-0.5">
									{formatarPreco(posto.precos.gnv)}
								</span>
							</div>
						</div>

						<!-- Paridade Etanol x Gasolina (Regra dos 70%) -->
						{#if paridade}
							<div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
								<div class="space-y-1 text-center sm:text-left">
									<div class="flex items-center justify-center sm:justify-start gap-2">
										<span class="text-xs font-bold uppercase tracking-wider text-blue-900">Análise de Paridade (70%)</span>
										<span class="px-2 py-0.5 text-xs font-extrabold rounded-md {paridade.recomendacao === 'etanol' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}">
											{paridade.razao}%
										</span>
									</div>
									<p class="text-xs text-slate-600">
										{#if paridade.recomendacao === 'etanol'}
											O preço do etanol custa <strong>menos de 70%</strong> da gasolina neste posto. Abastecer com etanol é economicamente superior!
										{:else}
											O etanol custa <strong>mais de 70%</strong> da gasolina. Abastecer com gasolina rende mais quilômetros por real gasto.
										{/if}
									</p>
								</div>

								{#if onAbrirCalculadora}
									<button
										type="button"
										onclick={() => {
											onClose();
											onAbrirCalculadora();
										}}
										class="px-3.5 py-2 text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-300 rounded-xl shadow-xs transition-colors shrink-0"
									>
										Simular Tanque Cheio
									</button>
								{/if}
							</div>
						{/if}
					{:else}
						<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
							<p class="text-xs font-semibold text-amber-900">Preços não informados na base recente online.</p>
							<p class="text-[11px] text-amber-700 mt-1">Este posto está regular perante a ANP. Os preços de bomba devem ser consultados no totem presencial do estabelecimento.</p>
						</div>
					{/if}
				</div>

				<!-- Seção 4: Eletroposto & Mobilidade Elétrica -->
				{#if posto.eletroposto.temEletroposto}
					<div class="border border-amber-200 bg-amber-50/50 rounded-2xl p-5">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
									<Zap class="w-5 h-5 fill-white" />
								</div>
								<div>
									<h3 class="font-bold text-base text-slate-900">Estação de Recarga para Veículos Elétricos</h3>
									<p class="text-xs text-slate-500">{posto.eletroposto.redeOperadora || 'Rede de Recarga de Mobilidade Elétrica'}</p>
								</div>
							</div>

							<div class="text-right">
								<span class="block text-[11px] text-slate-400 font-medium">Tarifa de Carregamento</span>
								<span class="text-sm font-black text-amber-950">
									{formatarPrecoKwh(posto.eletroposto.precoKwh, posto.eletroposto.tarifaGratuita)}
								</span>
							</div>
						</div>

						<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
							<div class="bg-white p-2.5 rounded-xl border border-amber-200/80">
								<span class="text-[10px] uppercase font-bold text-slate-400">Pontos de Carga</span>
								<span class="block text-sm font-bold text-slate-800 mt-0.5">
									{posto.eletroposto.qtdEstacoes ?? 1} {posto.eletroposto.qtdEstacoes === 1 ? 'vaga exclusiva' : 'vagas exclusivas'}
								</span>
							</div>

							<div class="bg-white p-2.5 rounded-xl border border-amber-200/80">
								<span class="text-[10px] uppercase font-bold text-slate-400">Potência Máxima</span>
								<span class="block text-sm font-bold text-amber-900 mt-0.5">
									{posto.eletroposto.potenciaMaxKw ? `${posto.eletroposto.potenciaMaxKw} kW (DC Rápido)` : 'AC Convencional'}
								</span>
							</div>

							<div class="bg-white p-2.5 rounded-xl border border-amber-200/80">
								<span class="text-[10px] uppercase font-bold text-slate-400">Disponibilidade</span>
								<span class="block text-sm font-bold text-emerald-700 mt-0.5">Operacional 24h</span>
							</div>
						</div>

						<!-- Conectores Suportados -->
						<div>
							<span class="text-xs font-bold text-slate-700 block mb-1.5">Conectores Disponíveis:</span>
							<div class="flex flex-wrap gap-2">
								{#each posto.eletroposto.conectores || [] as conector}
									<div class="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-2xs">
										<Zap class="w-3.5 h-3.5 text-amber-500" />
										<span>{conector.tipo} ({conector.potenciaKw} kW - {conector.corrente})</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Seção 5: Serviços, Conveniência e Comodidades -->
				<div>
					<h3 class="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
						<Store class="w-4 h-4 text-indigo-600" />
						Serviços e Infraestrutura
					</h3>

					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
						<div class="p-3 rounded-xl border {posto.servicos.conveniencia ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Loja de Conveniência</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.conveniencia ? (posto.servicos.nomeConveniencia || 'Disponível') : 'Não possui'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.calibrador ? 'bg-blue-50/50 border-blue-200 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Calibrador de Pneus</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.calibrador ? 'Disponível / Gratuito' : 'Não possui'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.trocaOleo ? 'bg-amber-50/50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Troca de Óleo</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.trocaOleo ? 'Serviço Ativo' : 'Não possui'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.lavagem ? 'bg-sky-50/50 border-sky-200 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Ducha / Lava-Rápido</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.lavagem ? 'Disponível' : 'Não possui'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.aberto24h ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'}">
							<span class="font-bold block">Horário de Funcionamento</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.aberto24h ? 'Aberto 24 Horas' : 'Horário Comercial'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.banheiroAcessivel ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Banheiro Acessível</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.banheiroAcessivel ? 'Adaptado PCD' : 'Padrão'}</span>
						</div>

						<div class="p-3 rounded-xl border {posto.servicos.lanchonete ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-400'}">
							<span class="font-bold block">Lanchonete / Café</span>
							<span class="text-[11px] block mt-0.5">{posto.servicos.lanchonete ? 'Disponível' : 'Não possui'}</span>
						</div>

						<div class="p-3 rounded-xl border bg-slate-100 border-slate-200 text-slate-800">
							<span class="font-bold block">Formas de Pagamento</span>
							<span class="text-[11px] block mt-0.5 truncate">{posto.servicos.formasPagamento?.join(', ') || 'Pix, Cartões'}</span>
						</div>
					</div>
				</div>

				<!-- Seção 6: Endereço & Traçar Rota -->
				<div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="text-xs text-slate-600">
						<span class="font-bold text-slate-800 block flex items-center gap-1.5">
							<MapPin class="w-4 h-4 text-blue-600" />
							Localização e Endereço
						</span>
						<p class="mt-1 leading-relaxed">
							{posto.endereco.logradouro}, {posto.endereco.numero || 's/n'}
							{#if posto.endereco.complemento} • {posto.endereco.complemento}{/if}
							<br />
							{posto.endereco.bairro} - {posto.endereco.municipio}/{posto.endereco.uf} • CEP: {posto.endereco.cep}
						</p>
					</div>

					<div class="flex items-center gap-2 flex-wrap shrink-0">
						<button
							type="button"
							onclick={copiarEndereco}
							class="px-3 py-2 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
						>
							<Copy class="w-3.5 h-3.5" />
							<span>{copiado ? 'Copiado!' : 'Copiar Endereço'}</span>
						</button>

						<button
							type="button"
							onclick={abrirRotaGoogleMaps}
							class="px-3 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
						>
							<Navigation class="w-3.5 h-3.5" />
							<span>Google Maps</span>
						</button>

						<button
							type="button"
							onclick={abrirRotaWaze}
							class="px-3 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
						>
							<span>Waze</span>
						</button>
					</div>
				</div>

			</div>

			<!-- Rodapé do Modal -->
			<div class="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
				<span>Central de Atendimento ANP: <strong>0800 970 0267</strong> (ligação gratuita)</span>
				<button
					type="button"
					onclick={onClose}
					class="px-4 py-2 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 transition-colors"
				>
					Fechar
				</button>
			</div>
		</div>
	</div>
{/if}
