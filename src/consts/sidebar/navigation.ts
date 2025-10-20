import {
	Bell,
	Calendar,
	CheckCircle2,
	Clock,
	Clock3,
	Eye,
	FolderOpen,
	FolderPlus,
	HandHeart,
	LayoutDashboard,
	Target,
	TrendingUp,
	Workflow,
} from "lucide-react";

export const SIDEBAR_ITEMS = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutDashboard,
		},
		{
			title: "Proyectos",
			icon: FolderOpen,
			items: [
				{
					title: "Todos los Proyectos",
					url: "/proyectos",
					icon: FolderOpen,
				},
				{
					title: "Nuevo proyecto",
					url: "/proyectos/nuevo",
					icon: FolderPlus,
				},
				{
					title: "En Planificacion",
					url: "/proyectos/planificacion",
					icon: Clock3,
					badge: "12",
				},
				{
					title: "En Ejecucion",
					url: "/proyectos/ejecucion",
					icon: Workflow,
					badge: "8",
				},
			],
		},
		{
			title: "Colaboraciones",
			icon: HandHeart, // 🤝❤️ Mano con corazón (ayuda)
			items: [
				{
					title: "Pedidos Activos",
					url: "/pedidos",
					icon: Target, // 🎯 Objetivo/meta
					badge: "5",
				},
				{
					title: "Mis Compromisos",
					url: "/compromisos",
					icon: CheckCircle2, // ✅ Check círculo
				},
				{
					title: "Notificaciones",
					url: "/notificaciones",
					icon: Bell, // 🔔 Campana clásica
					badge: "3",
				},
			],
		},
		{
			title: "Seguimiento",
			icon: Eye, // 👁️ Ojo para vigilar/monitorear
			items: [
				{
					title: "Proyectos en Curso",
					url: "/seguimiento/proyectos",
					icon: TrendingUp, // 📈 Tendencia hacia arriba
				},
				{
					title: "Control Quincenal",
					url: "/seguimiento/control",
					icon: Calendar, // 📅 Calendario
					badge: "2",
				},
				{
					title: "Cronograma",
					url: "/seguimiento/cronograma",
					icon: Clock, // 🕐 Reloj simple
				},
			],
		},
	],
};
