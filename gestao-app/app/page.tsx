import Link from "next/link";

export default function Home() {
  const features = [
    { title: "Cadastro Único", link: "/cadastroUnico", description: "Realize cadastro de agendamentos para serviços de cadastro único." },
    { title: "Casa do Cidadão", link: "/casaDoCidadao", description: "Realize cadastro de agendamentos para serviços de 1º via RG, 2º via RG e reservista." },
    // { title: "Outros Serviços", link: "/outrosServicos", description: "Acesse diversos serviços públicos em um só lugar." }
    { title: "Dashboard",  link: "/dashboard", description: "Acesso as entrevistas" }
  ];

  return (
    <section id="features" className="py-16 px-4 container mx-auto text-center">
      <h3 className="text-3xl font-bold text-gray-800">Nossos recursos</h3>
      <p className="text-gray-500 mt-2">Facilidade e rapidez ao seu alcance.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <div key={index} className="shadow-lg hover:shadow-xl transition-shadow rounded-xl bg-white p-6">
            <h4 className="text-indigo-600 text-xl font-semibold">{feature.title}</h4>
            <p className="text-gray-600 mt-2 mb-4">{feature.description}</p>
            <Link href={feature.link} className="inline-block">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md">
                Acessar
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
