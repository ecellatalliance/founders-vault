import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Rocket } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 -z-10 opacity-10 dark:opacity-5">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl filter" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl filter" />
                </div>

                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                        Build. <span className="text-primary">Launch.</span> Scale.
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                        The ultimate ecosystem for student founders. Access resources, connect with mentors, and launch your startup.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <Link to="/shop" className="btn-primary text-lg px-8 py-4 rounded-full flex items-center gap-2">
                            Start Building <ArrowRight size={20} />
                        </Link>
                        <Link to="/community" className="px-8 py-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
                            Join Community
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Resources</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Access a curated library of tools, templates, and guides to accelerate your startup journey.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Users size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Mentorship</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Connect with industry experts and alumni who can guide you through challenges.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                        <Rocket size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Incubation</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Get support for your idea from validation to funding and launch.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
