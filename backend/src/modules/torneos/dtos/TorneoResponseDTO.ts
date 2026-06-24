export interface TorneoResponseDTO {
  id: string;
  nombre: string;
  categoria: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: 'proximo' | 'en_curso' | 'finalizado';
  descripcion: string | null;
  logo_url: string | null;
  resultado: string | null;
}
