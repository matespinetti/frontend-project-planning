import { CreateProjectForm } from "@/components/proyectos/create_project_form";

export default function NuevoProyectoPage() {
	return (
		<div className="flex flex-col gap-6 py-6 px-4 lg:px-6">
			<CreateProjectForm />
		</div>
	);
}
