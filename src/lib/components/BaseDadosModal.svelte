<script lang="ts">
	import {
		X,
		Database,
		FileSpreadsheet,
		UploadCloud,
		CheckCircle2,
		AlertCircle,
		ExternalLink,
		RefreshCw,
		Sparkles
	} from '@lucide/svelte';
	import { importarCsvUsuario } from '#lib/services/postosClient';

	interface Props {
		aberto: boolean;
		estadoAtual: string;
		totalPostosEstado: number;
		onClose: () => void;
		onCsvAtualizado: () => void;
	}

	let { aberto, estadoAtual, totalPostosEstado, onClose, onCsvAtualizado }: Props = $props();

	let carregandoArquivo = $state(false);
	let mensagemSucesso = $state<string | null>(null);
	let mensagemErro = $state<string | null>(null);
	let inputArquivo = $state<HTMLInputElement | null>(null);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	async function handleArquivoSelecionado(e: Event) {
		const target = e.target as HTMLInputElement;
		const arquivo = target.files?.[0];
		if (!arquivo) return;

		carregandoArquivo = true;
		mensagemSucesso = null;
		mensagemErro = null;

		try {
			const texto = await arquivo.text();
			if (!texto || texto.length < 500) {
				throw new Error('O arquivo selecionado parece estar vazio ou não é um CSV válido.');
			}

			const resultado = await importarCsvUsuario(texto);
			mensagemSucesso = `CSV importado com sucesso! ${resultado.totalValidos.toLocaleString('pt-BR')} postos processados em ${resultado.ufs.length} estados.`;
			onCsvAtualizado();
		} catch (err: any) {
			console.error('Erro ao processar CSV:', err);
			mensagemErro = err?.message || 'Falha ao processar arquivo CSV. Certifique-se de que é a planilha oficial da ANP.';
		} finally {
			carregandoArquivo = false;
			if (inputArquivo) inputArquivo.value = '';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if aberto}
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-base-dados-titulo"
	>
		<div
			class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
		>
			<!-- Cabeçalho -->
			<div class="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
						<Database class="w-6 h-6" />
					</div>
					<div>
						<h2 id="modal-base-dados-titulo" class="text-lg sm:text-xl font-black tracking-tight">
							Base de Dados & Definição dos Postos
						</h2>
						<p class="text-xs text-blue-100">
							Dados oficiais da ANP processados dinamicamente no navegador
						</p>
					</div>
				</div>

				<button
					type="button"
					onclick={onClose}
					class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
					aria-label="Fechar"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Conteúdo -->
			<div class="overflow-y-auto p-6 space-y-6 flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
				<!-- Status Atual -->
				<div class="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
								Ativo & Conectado
							</span>
							<span class="text-xs font-bold text-slate-800">CSV Oficial ANP</span>
						</div>
						<p class="text-xs text-slate-600">
							Mais de <strong>43.900 postos</strong> em todo o território nacional mapeados diretamente a partir dos dados abertos governamentais.
						</p>
					</div>
					<div class="text-right sm:border-l sm:border-blue-200 sm:pl-4 whitespace-nowrap">
						<div class="text-2xl font-black text-blue-700">{totalPostosEstado.toLocaleString('pt-BR')}</div>
						<div class="text-[11px] text-slate-500 font-medium">postos em {estadoAtual}</div>
					</div>
				</div>

				<!-- Informações Técnicas -->
				<div class="space-y-3">
					<h3 class="font-bold text-sm text-slate-900 flex items-center gap-2">
						<FileSpreadsheet class="w-4 h-4 text-blue-600" />
						Origem e Estrutura dos Dados
					</h3>
					<p class="text-xs text-slate-600 leading-relaxed">
						O sistema lê e processa diretamente o arquivo <code class="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[11px]">dados-cadastrais-revendedores-varejistas-combustiveis-automoveis.csv</code>.
						Cada registro inclui código SIMP, autorização, CNPJ, razão social, endereço completo, bandeira e vinculação.
					</p>
					<ul class="space-y-2 text-xs text-slate-600">
						<li class="flex items-start gap-2">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
							<span><strong>Geolocalização Inteligente:</strong> Cruza os municípios com a base de coordenadas do IBGE para posicionamento geográfico preciso e cálculo de rotas.</span>
						</li>
						<li class="flex items-start gap-2">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
							<span><strong>Processamento Client-Side:</strong> Todo o parsing é realizado no próprio navegador em poucos milissegundos, garantindo compatibilidade total com GitHub Pages.</span>
						</li>
						<li class="flex items-start gap-2">
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
							<span><strong>Tolerância a Falhas:</strong> Registros corrompidos ou incompletos são filtrados de forma segura, com fallback automático em JSON para conexões lentas.</span>
						</li>
					</ul>
				</div>

				<!-- Carregar Novo CSV -->
				<div class="border-t border-slate-200/80 pt-5 space-y-3">
					<h3 class="font-bold text-sm text-slate-900 flex items-center gap-2">
						<UploadCloud class="w-4 h-4 text-indigo-600" />
						Definir Novo Arquivo CSV (Opcional)
					</h3>
					<p class="text-xs text-slate-600">
						Deseja testar uma versão recém-baixada do portal da ANP? Selecione o arquivo CSV abaixo para que o navegador recalcule todos os postos instantaneamente em memória:
					</p>

					<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<input
							type="file"
							accept=".csv,text/csv"
							bind:this={inputArquivo}
							onchange={handleArquivoSelecionado}
							class="hidden"
							id="input-csv-upload"
						/>
						<label
							for="input-csv-upload"
							class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition shadow-xs cursor-pointer hover:shadow"
						>
							{#if carregandoArquivo}
								<RefreshCw class="w-4 h-4 animate-spin" />
								<span>Processando CSV...</span>
							{:else}
								<UploadCloud class="w-4 h-4" />
								<span>Escolher Arquivo CSV da ANP</span>
							{/if}
						</label>

						<a
							href="https://dados.gov.br/dados/conjuntos-dados/postos-de-combustiveis-automotivos"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
						>
							<span>Portal Dados Abertos ANP</span>
							<ExternalLink class="w-3.5 h-3.5" />
						</a>
					</div>

					{#if mensagemSucesso}
						<div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
							<CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-600" />
							<span>{mensagemSucesso}</span>
						</div>
					{/if}

					{#if mensagemErro}
						<div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
							<AlertCircle class="w-4 h-4 shrink-0 text-rose-600" />
							<span>{mensagemErro}</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Rodapé do Modal -->
			<div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
				<button
					type="button"
					onclick={onClose}
					class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl text-xs transition cursor-pointer"
				>
					Fechar
				</button>
			</div>
		</div>
	</div>
{/if}
