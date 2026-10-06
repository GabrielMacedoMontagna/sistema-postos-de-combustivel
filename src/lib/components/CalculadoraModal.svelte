<script lang="ts">
	import {
		X,
		Calculator,
		Fuel,
		ArrowRight,
		Percent,
		Sparkles,
		CheckCircle2,
		AlertCircle,
		Sliders,
		TrendingDown,
		Coins
	} from '@lucide/svelte';

	interface Props {
		aberto: boolean;
		precoGasolinaInicial?: number;
		precoEtanolInicial?: number;
		onClose: () => void;
	}

	let {
		aberto,
		precoGasolinaInicial = 5.89,
		precoEtanolInicial = 3.99,
		onClose
	}: Props = $props();

	let precoGasolina = $state(5.89);
	let precoEtanol = $state(3.99);
	let fatorEficiencia = $state(70); // 70% padrão de mercado para veículos flex
	let capacidadeTanque = $state(50); // 50 litros padrão
	let kmMensal = $state(1000); // 1000 km por mês para projeção

	// Consumo médio de referência para simulação financeira
	const consumoGasolinaKmL = 11.0;

	// Atualiza os valores se as props iniciais mudarem
	$effect(() => {
		precoGasolina = precoGasolinaInicial ?? 5.89;
		precoEtanol = precoEtanolInicial ?? 3.99;
	});

	// Cálculos
	const razaoAtual = $derived(
		precoGasolina > 0 ? (precoEtanol / precoGasolina) * 100 : 0
	);

	const compensaEtanol = $derived(razaoAtual <= fatorEficiencia);

	// Preço máximo que o etanol poderia custar para ainda compensar
	const precoMaximoEtanol = $derived(
		(precoGasolina * (fatorEficiencia / 100))
	);

	// Simulação de custo por Km
	const consumoEtanolKmL = $derived(
		consumoGasolinaKmL * (fatorEficiencia / 100)
	);

	const custoKmGasolina = $derived(
		consumoGasolinaKmL > 0 ? precoGasolina / consumoGasolinaKmL : 0
	);

	const custoKmEtanol = $derived(
		consumoEtanolKmL > 0 ? precoEtanol / consumoEtanolKmL : 0
	);

	// Economia mensal em R$ rodando a quilometragem especificada
	const custoMensalGasolina = $derived(custoKmGasolina * kmMensal);
	const custoMensalEtanol = $derived(custoKmEtanol * kmMensal);
	const economiaMensal = $derived(
		Math.abs(custoMensalGasolina - custoMensalEtanol)
	);

	// Custo do tanque cheio
	const custoTanqueGasolina = $derived(precoGasolina * capacidadeTanque);
	const custoTanqueEtanol = $derived(precoEtanol * capacidadeTanque);

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
		aria-labelledby="modal-calc-titulo"
	>
		<div
			class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
		>
			<!-- Cabeçalho -->
			<div class="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
						<Calculator class="w-5 h-5" />
					</div>
					<div>
						<h2 id="modal-calc-titulo" class="text-lg sm:text-xl font-black tracking-tight">
							Calculadora Etanol vs Gasolina
						</h2>
						<p class="text-xs text-emerald-100">
							Descubra qual combustível traz mais autonomia por real gasto
						</p>
					</div>
				</div>

				<button
					type="button"
					onclick={onClose}
					class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
					aria-label="Fechar calculadora"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Conteúdo com Scroll -->
			<div class="overflow-y-auto p-6 space-y-6 flex-1">
				
				<!-- Bloco de Resultado / Veredito -->
				<div class="p-5 rounded-2xl border transition-all text-center {compensaEtanol ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' : 'bg-amber-50/90 border-amber-300 text-amber-950'}">
					<span class="text-xs font-bold uppercase tracking-wider block mb-1">
						Veredito da Paridade ({razaoAtual.toFixed(1)}%)
					</span>

					<h3 class="text-2xl sm:text-3xl font-black mb-2 flex items-center justify-center gap-2">
						{#if compensaEtanol}
							<span>🍃 Compensa abastecer com ETANOL</span>
						{:else}
							<span>⛽ Compensa abastecer com GASOLINA</span>
						{/if}
					</h3>

					<p class="text-xs sm:text-sm max-w-lg mx-auto opacity-90 leading-relaxed">
						{#if compensaEtanol}
							O etanol custa <strong>{razaoAtual.toFixed(1)}%</strong> do valor da gasolina (abaixo do teto de {fatorEficiencia}%). Para o etanol deixar de ser vantajoso, seu preço teria que subir para mais de <strong>R$ {precoMaximoEtanol.toFixed(2)}</strong>.
						{:else}
							O etanol custa <strong>{razaoAtual.toFixed(1)}%</strong> do valor da gasolina (acima do teto de {fatorEficiencia}%). A gasolina rende mais quilômetros por real investido no seu motor.
						{/if}
					</p>

					<!-- Comparativo de Custo Mensal -->
					<div class="mt-4 pt-4 border-t {compensaEtanol ? 'border-emerald-200' : 'border-amber-200'} grid grid-cols-2 gap-3 text-left">
						<div class="bg-white/80 p-3 rounded-xl">
							<span class="block text-[11px] font-bold text-slate-500 uppercase">Custo / Km Rodado</span>
							<div class="flex items-baseline gap-2 mt-0.5">
								<span class="text-sm font-bold text-slate-700">Gasolina: R$ {custoKmGasolina.toFixed(2)}</span>
								<span class="text-sm font-bold {compensaEtanol ? 'text-emerald-700 font-extrabold' : 'text-slate-700'}">Etanol: R$ {custoKmEtanol.toFixed(2)}</span>
							</div>
						</div>

						<div class="bg-white/80 p-3 rounded-xl">
							<span class="block text-[11px] font-bold text-slate-500 uppercase">Economia Prevista ({kmMensal} km/mês)</span>
							<span class="text-base font-black {compensaEtanol ? 'text-emerald-700' : 'text-amber-800'} block mt-0.5">
								R$ {economiaMensal.toFixed(2)} / mês
							</span>
						</div>
					</div>
				</div>

				<!-- Entradas de Preços -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					
					<!-- Preço da Gasolina -->
					<div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
						<label for="input-gasolina" class="block text-xs font-bold text-slate-700 mb-1">
							Preço da Gasolina Comum (R$/Litro)
						</label>
						<div class="relative">
							<span class="absolute left-3 inset-y-0 flex items-center text-sm font-bold text-slate-400">R$</span>
							<input
								id="input-gasolina"
								type="number"
								step="0.01"
								min="1.00"
								max="15.00"
								bind:value={precoGasolina}
								class="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<span class="text-[11px] text-slate-400 mt-1 block">Tanque ({capacidadeTanque}L): R$ {custoTanqueGasolina.toFixed(2)}</span>
					</div>

					<!-- Preço do Etanol -->
					<div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
						<label for="input-etanol" class="block text-xs font-bold text-slate-700 mb-1">
							Preço do Etanol Hidratado (R$/Litro)
						</label>
						<div class="relative">
							<span class="absolute left-3 inset-y-0 flex items-center text-sm font-bold text-slate-400">R$</span>
							<input
								id="input-etanol"
								type="number"
								step="0.01"
								min="1.00"
								max="15.00"
								bind:value={precoEtanol}
								class="w-full pl-10 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
							/>
						</div>
						<span class="text-[11px] text-slate-400 mt-1 block">Tanque ({capacidadeTanque}L): R$ {custoTanqueEtanol.toFixed(2)}</span>
					</div>

				</div>

				<!-- Configurações Avançadas de Eficiência -->
				<div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
							<Sliders class="w-4 h-4 text-blue-600" />
							Ajuste Fino: Fator de Eficiência do seu Carro
						</span>
						<span class="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
							{fatorEficiencia}%
						</span>
					</div>

					<input
						type="range"
						min="65"
						max="75"
						step="1"
						bind:value={fatorEficiencia}
						class="w-full accent-blue-600 cursor-pointer"
					/>

					<div class="flex justify-between text-[10px] text-slate-500 font-medium">
						<span>65% (Motores antigos ou trajetos curtos)</span>
						<span class="font-bold text-blue-600">70% (Média brasileira de referência)</span>
						<span>75% (Injeção direta / motores modernos)</span>
					</div>

					<!-- Sliders de Tanque e Quilometragem -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
						<div>
							<div class="flex justify-between text-xs font-medium text-slate-700 mb-1">
								<span>Capacidade do Tanque:</span>
								<strong>{capacidadeTanque} Litros</strong>
							</div>
							<input
								type="range"
								min="35"
								max="80"
								step="1"
								bind:value={capacidadeTanque}
								class="w-full accent-slate-600 cursor-pointer"
							/>
						</div>

						<div>
							<div class="flex justify-between text-xs font-medium text-slate-700 mb-1">
								<span>Quilometragem Mês:</span>
								<strong>{kmMensal} km</strong>
							</div>
							<input
								type="range"
								min="200"
								max="3000"
								step="100"
								bind:value={kmMensal}
								class="w-full accent-slate-600 cursor-pointer"
							/>
						</div>
					</div>
				</div>

				<!-- Explicação Educativa -->
				<div class="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs text-blue-950 space-y-2">
					<div class="font-bold flex items-center gap-1.5 text-blue-900">
						<Sparkles class="w-4 h-4 text-blue-600" />
						Por que existe a regra dos 70%?
					</div>
					<p class="leading-relaxed text-slate-700">
						O etanol hidratado possui uma densidade energética menor (cerca de 30% a menos) em comparação com a gasolina pura. Por esse motivo, motores flex consomem aproximadamente 30% a mais de volume de combustível para produzir o mesmo trabalho.
					</p>
					<p class="leading-relaxed text-slate-700">
						Assim, <strong>se o preço do etanol for inferior a 70% do preço da gasolina</strong>, o custo financeiro por quilômetro rodado no etanol torna-se menor, tornando o biocombustível a escolha mais econômica e ecológica.
					</p>
				</div>

			</div>

			<!-- Rodapé -->
			<div class="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
				<button
					type="button"
					onclick={onClose}
					class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
				>
					Entendido, Voltar aos Postos
				</button>
			</div>
		</div>
	</div>
{/if}
