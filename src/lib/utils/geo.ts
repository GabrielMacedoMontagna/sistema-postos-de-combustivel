import type { Coordenadas } from '#lib/types';

/**
 * Calcula a distância em quilômetros entre dois pontos usando a fórmula de Haversine
 */
export function calcularDistanciaKm(
	coord1: Coordenadas,
	coord2: Coordenadas
): number {
	const R = 6371; // Raio da Terra em km
	const dLat = grausParaRadianos(coord2.lat - coord1.lat);
	const dLng = grausParaRadianos(coord2.lng - coord1.lng);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(grausParaRadianos(coord1.lat)) *
			Math.cos(grausParaRadianos(coord2.lat)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;

	return Number(d.toFixed(2));
}

function grausParaRadianos(graus: number): number {
	return graus * (Math.PI / 180);
}

export function formatarDistancia(km?: number | null): string {
	if (km === undefined || km === null || isNaN(km)) return '';
	if (km < 1) {
		const metros = Math.round(km * 1000);
		return `${metros} m`;
	}
	return `${km.toFixed(1).replace('.', ',')} km`;
}

export interface CidadeCoordenadas {
	nome: string;
	uf: string;
	lat: number;
	lng: number;
	zoom: number;
}

export const CIDADES_BRASIL: Record<string, CidadeCoordenadas> = {
	'São Paulo': { nome: 'São Paulo', uf: 'SP', lat: -23.5505, lng: -46.6333, zoom: 12 },
	'Rio de Janeiro': { nome: 'Rio de Janeiro', uf: 'RJ', lat: -22.9068, lng: -43.1729, zoom: 12 },
	'Curitiba': { nome: 'Curitiba', uf: 'PR', lat: -25.4284, lng: -49.2733, zoom: 12 },
	'Belo Horizonte': { nome: 'Belo Horizonte', uf: 'MG', lat: -19.9167, lng: -43.9345, zoom: 12 },
	'Brasília': { nome: 'Brasília', uf: 'DF', lat: -15.7975, lng: -47.8919, zoom: 12 },
	'Porto Alegre': { nome: 'Porto Alegre', uf: 'RS', lat: -30.0346, lng: -51.2177, zoom: 12 },
	'Salvador': { nome: 'Salvador', uf: 'BA', lat: -12.9777, lng: -38.5016, zoom: 12 },
	'Recife': { nome: 'Recife', uf: 'PE', lat: -8.0476, lng: -34.877, zoom: 12 },
	'Fortaleza': { nome: 'Fortaleza', uf: 'CE', lat: -3.7319, lng: -38.5267, zoom: 12 },
	'Goiânia': { nome: 'Goiânia', uf: 'GO', lat: -16.6869, lng: -49.2648, zoom: 12 },
	'Campinas': { nome: 'Campinas', uf: 'SP', lat: -22.9099, lng: -47.0626, zoom: 12 },
	'Florianópolis': { nome: 'Florianópolis', uf: 'SC', lat: -27.5954, lng: -48.548, zoom: 12 },
	'Manaus': { nome: 'Manaus', uf: 'AM', lat: -3.119, lng: -60.0217, zoom: 12 },
	'Belém': { nome: 'Belém', uf: 'PA', lat: -1.4558, lng: -48.4902, zoom: 12 },
	'Vitória': { nome: 'Vitória', uf: 'ES', lat: -20.3155, lng: -40.3128, zoom: 12 }
};
