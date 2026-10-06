<script lang="ts">
	import {
		X,
		ShieldCheck,
		ExternalLink,
		CheckCircle2,
		AlertCircle,
		PhoneCall,
		FileText,
		FlaskConical,
		Gauge,
		Layers,
		Sparkles
	} from '@lucide/svelte';

	interface Props {
		aberto: boolean;
		onClose: () => void;
	}

	let { aberto, onClose }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if aberto}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-guia-anp-titulo"
	>
		<div
			class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
		>
			<!-- Cabeçalho -->
			<div class="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
						<ShieldCheck class="w-6 h-6" />
					</div>
					<div>
						<h2 id="modal-guia-anp-titulo" class="text-lg sm:text-xl font-black tracking-tight">
							Guia de Qualidade & Fiscalização ANP
						</h2>
						<p class="text-xs text-emerald-100">
							Conheça seus direitos, as normas vigentes e como identificar combustível de qualidade
						</p>
					</div>
				</div>

				<button
					type="button"
					onclick={onClose}
					class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
					aria-label="Fechar guia"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Conteúdo com Scroll -->
			<div class="overflow-y-auto p-6 space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
				
				<!-- Seção 1: O que é a ANP e o Portal ANP Com Você -->
				<div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
					<h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
						<FileText class="w-4 h-4 text-emerald-700" />
						O que é a ANP e como funciona o registro?
					</h3>
					<p>
						A <strong>Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP)</strong> é a autarquia federal responsável por regular, contratar e fiscalizar as atividades da indústria de combustíveis no Brasil.
					</p>
					<p>
						Todo posto revendedor precisa de uma <strong>Autorização de Operação</strong> expedida pela ANP, além de manter um cadastro no <strong>Sistema de Informações de Movimentação de Produtos (SIMP)</strong>. O portal oficial <a href="https://anpcomvcpostos.anp.gov.br" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-bold hover:underline inline-flex items-center gap-1">ANP Com Você <ExternalLink class="w-3 h-3" /></a> disponibiliza publicamente a conformidade das fiscalizações e histórico de autos de infração.
					</p>
				</div>

				<!-- Seção 2: Bandeira de Marca vs Bandeira Branca -->
				<div class="space-y-3">
					<h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
						<Layers class="w-4 h-4 text-blue-600" />
						Bandeira Contratada vs Bandeira Branca (Independente)
					</h3>
					
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
						<div class="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-2">
							<span class="font-bold text-blue-900 text-sm block">Postos de Bandeira Exclusiva</span>
							<p class="text-xs text-slate-600">
								Ostentam a marca de uma grande distribuidora (Vibra/Petrobras, Ipiranga, Shell/Raízen, ALE, Rodoil, etc.).
							</p>
							<p class="text-xs text-slate-600">
								<strong>Regra obrigatória:</strong> São legalmente proibidos de vender combustíveis de outras distribuidoras. Todo o produto fornecido deve vir estritamente da marca exibida na testeira.
							</p>
						</div>

						<div class="bg-zinc-100/70 p-4 rounded-2xl border border-zinc-300 space-y-2">
							<span class="font-bold text-zinc-900 text-sm block">Postos de Bandeira Branca</span>
							<p class="text-xs text-slate-600">
								Não possuem contrato de fidelidade com distribuidoras e podem comprar combustíveis no mercado atacadista autorizado que oferecer o melhor custo.
							</p>
							<p class="text-xs text-slate-600">
								<strong>Regra obrigatória:</strong> Devem obrigatoriamente identificar em <em>cada bomba</em> o nome da distribuidora que entregou aquele lote de combustível.
							</p>
						</div>
					</div>
				</div>

				<!-- Seção 3: Direitos do Consumidor na Bomba -->
				<div class="space-y-3">
					<h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
						<Sparkles class="w-4 h-4 text-amber-600" />
						Os 3 Testes Gratuitos que o Consumidor Tem Direito
					</h3>

					<div class="space-y-3">
						<!-- Teste 1: Proveta -->
						<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
							<div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
								<FlaskConical class="w-5 h-5" />
							</div>
							<div>
								<h4 class="font-bold text-sm text-slate-900">1. Teste da Proveta (Teor de Etanol na Gasolina)</h4>
								<p class="text-xs text-slate-600 mt-1">
									Mede a porcentagem de etanol anidro misturado na gasolina comum ou aditivada. Por determinação do Conselho Interministerial do Açúcar e do Álcool (CIMA), o teor oficial é de <strong>27% de etanol anidro</strong> (com margem de tolerância de ±1%, ou seja, entre 26% e 28%).
								</p>
								<p class="text-xs text-slate-500 mt-1 italic">
									* O frentista é obrigado por lei a realizar o teste de proveta de 100ml com água na sua presença, caso solicitado.
								</p>
							</div>
						</div>

						<!-- Teste 2: Bomba de 20 Litros -->
						<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
							<div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
								<Gauge class="w-5 h-5" />
							</div>
							<div>
								<h4 class="font-bold text-sm text-slate-900">2. Teste do Volume (Medida-Padrão de 20 Litros)</h4>
								<p class="text-xs text-slate-600 mt-1">
									Verifica se a bomba está entregando a quantidade exata de combustível marcada no visor. O posto deve possuir um recipiente volumétrico de 20 litros, selado e aferido periodicamente pelo <strong>INMETRO</strong>.
								</p>
								<p class="text-xs text-slate-600 mt-1">
									A variação tolerada é de no máximo <strong>±100 mililitros em 20 litros (0,5%)</strong>. Diferenças superiores indicam "bomba baixa" (fraude volumétrica).
								</p>
							</div>
						</div>

						<!-- Teste 3: Termodensímetro -->
						<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
							<div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
								<CheckCircle2 class="w-5 h-5" />
							</div>
							<div>
								<h4 class="font-bold text-sm text-slate-900">3. Termodensímetro no Etanol</h4>
								<p class="text-xs text-slate-600 mt-1">
									O etanol hidratado vendido na bomba deve possuir densidade entre <strong>0,8075 e 0,8110 g/cm³</strong> a 20°C. Cada bomba de etanol possui obrigatoriamente um tubo de vidro transparente com termodensímetro flutuante, onde a linha do líquido deve ficar alinhada com a faixa vermelha central do densímetro.
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Seção 4: Canais Oficiais de Denúncia -->
				<div class="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div class="space-y-1 text-center sm:text-left">
						<span class="font-bold text-amber-950 flex items-center justify-center sm:justify-start gap-2">
							<AlertCircle class="w-4 h-4 text-amber-700" />
							Presenciou irregularidade ou recusa de teste?
						</span>
						<p class="text-xs text-amber-900">
							A recusa em realizar os testes previstos em norma constitui infração grave. Guarde o cupom fiscal com CNPJ e denuncie imediatamente.
						</p>
					</div>

					<div class="flex items-center gap-2 shrink-0">
						<a
							href="tel:08009700267"
							class="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
						>
							<PhoneCall class="w-3.5 h-3.5" />
							<span>0800 970 0267</span>
						</a>
						<a
							href="https://anpcomvcpostos.anp.gov.br"
							target="_blank"
							rel="noopener noreferrer"
							class="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-amber-300 shadow-xs transition-colors flex items-center gap-1"
						>
							<span>Portal Web</span>
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>
				</div>

			</div>

			<!-- Rodapé -->
			<div class="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
				<button
					type="button"
					onclick={onClose}
					class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
				>
					Fechar Guia
				</button>
			</div>
		</div>
	</div>
{/if}
