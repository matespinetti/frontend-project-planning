export const TIPOS_PROYECTO = [
	{ value: "construccion", label: "Mejora de construcciones" },
	{ value: "energia", label: "Paneles solares" },
	{ value: "agua", label: "Sistemas de potabilización" },
	{ value: "infraestructura", label: "Mejora de calles" },
	{ value: "educacion", label: "Infraestructura educativa" },
	{ value: "salud", label: "Centros de salud" },
] as const;

export const TIPOS_PEDIDO = [
	{ value: "economico", label: "Apoyo Económico", icon: "💰" },
	{ value: "materiales", label: "Materiales", icon: "🧱" },
	{ value: "mano_obra", label: "Mano de Obra", icon: "👷" },
	{ value: "equipamiento", label: "Equipamiento", icon: "🔧" },
	{ value: "transporte", label: "Transporte", icon: "🚛" },
] as const;

export const PAISES = [
	{ code: "AR", name: "Argentina" },
	{ code: "BO", name: "Bolivia" },
	{ code: "BR", name: "Brasil" },
	{ code: "CL", name: "Chile" },
	{ code: "CO", name: "Colombia" },
	{ code: "EC", name: "Ecuador" },
	{ code: "PE", name: "Perú" },
	{ code: "UY", name: "Uruguay" },
	{ code: "VE", name: "Venezuela" },
] as const;
