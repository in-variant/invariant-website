import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalTrigger } from '@/components/ui/animated-modal';

const members = [
    {
        name: 'Mr. Satish Kumar Nigam',
        role: 'Co-Founder & Director',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        link: '#',
        bio: '24+ years of experience in pharmaceutical marketing and sales leadership. Passionate about healthcare, rural development, and empowering communities.'
    },
    {
        name: 'Mr. Santosh Singh',
        role: 'Co-Founder & Director',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
        link: '#',
        bio: '25+ years driving affordable, innovative healthcare access. Leads InVariant with a vision rooted in quality, technology, and patient-first values.'
    },
    {
        name: 'Mr. Ashwani Kumar Dixit',
        role: 'Co-Founder & Director',
        avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80',
        link: '#',
        bio: '20+ years of healthcare expertise. Guided by People, Peace & Prosperity, focusing on building value through continuous innovation and integrity.'
    },
    {
        name: 'Mr. Gaurav Gupta',
        role: 'Co-Founder & Director',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
        link: '#',
        bio: 'Sales and marketing leader with 25+ years across top global pharma companies. Dedicated to making quality medicines within everyone’s reach.'
    },
    {
        name: 'Mr. Umang Gupta',
        role: 'Co-founder, Advisor & Investor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        link: '#',
        bio: 'Former KKR Director based in the UK. Specializes in deep tech, oncology, and strategic investments shaping early-stage healthcare ventures.'
    },
    {
        name: 'Mr. Satyam Nigam',
        role: 'Co-founder, Advisor & Investor',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=800&q=80',
        link: '#',
        bio: 'Financial and IT expert at Barclays, UK. Merges technological insight with financial acumen to drive InVariant’s global innovation strategy.'
    },
    {
        name: 'Dr. Vandana Gupta',
        role: 'Advisory Board Member',
        avatar: 'https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=800&q=80',
        link: '#',
        bio: 'Assistant Professor in Pharmaceutical Sciences, SHUATS. Guides InVariant towards research-backed, patient-centric scientific methodologies.'
    },
    {
        name: 'Mr. Anurag Srivastav',
        role: 'Sales Training & Advisory',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
        link: '#',
        bio: 'Certified Soft Skills Trainer and MBA. Empowers InVariant’s Front Line Managers and medical representatives with high-impact leadership training.'
    },
]

export function TeamSection() {
    return (
        <section className="bg-[#0a0a0a] py-16 md:py-32">
            <div className="mx-auto max-w-6xl border-t border-white/10 px-6">
                <span className="text-xs uppercase tracking-widest font-bold -ml-6 -mt-3.5 block w-max bg-[#0a0a0a] px-6 text-emerald-400">Our Leadership</span>
                <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
                    <div className="sm:w-3/4">
                        <h2 className="text-3xl font-bold sm:text-5xl text-white tracking-tight">The Visionaries Driving InVariant</h2>
                    </div>
                    <div className="mt-6 sm:mt-0 text-gray-400">
                        <p className="text-lg">Our leadership blends decades of deep pharmaceutical expertise with sharp business acumen, ensuring every formulation is delivered with uncompromised ethics and patient focus.</p>
                    </div>
                </div>
                
                <div className="mt-16 md:mt-24">
                    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {members.map((member, index) => (
                            <div key={index} className="group overflow-hidden rounded-xl bg-[#111111] border border-white/5 shadow-xl transition-all duration-300 hover:border-emerald-400/50 hover:bg-[#151515]">
                                <Modal>
                                  <div className="h-64 w-full overflow-hidden relative">
                                    <img className="h-full w-full object-cover object-top grayscale transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0" src={member.avatar} alt={member.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80 pointer-events-none" />
                                  </div>
                                  <div className="px-5 py-6 flex flex-col h-full relative z-10 bg-[#111111]">
                                      <div className="flex flex-col gap-1">
                                          <h3 className="text-white text-lg font-bold transition-all duration-300">{member.name}</h3>
                                          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{member.role}</span>
                                      </div>
                                      
                                      <div className="mt-4 flex flex-col items-start gap-2">
                                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
                                              {member.bio}
                                          </p>
                                          <ModalTrigger className="text-emerald-400 hover:text-emerald-500 text-xs font-bold p-0 bg-transparent flex items-center mt-1">
                                            Read More
                                          </ModalTrigger>
                                      </div>

                                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                          <Link to={member.link} className="flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors">
                                              <Linkedin className="w-4 h-4" />
                                              LinkedIn
                                          </Link>
                                          <span className="text-white/20 font-mono text-xs">0{index + 1}</span>
                                      </div>
                                  </div>
                                  
                                  <ModalBody>
                                    <ModalContent className="dark:bg-[#111111] border border-white/10 dark:border-white/10 shadow-[0_0_60px_rgba(52,211,153,0.1)] rounded-2xl flex flex-col items-center pt-10 text-center">
                                      <div className="h-40 w-40 rounded-full overflow-hidden mb-6 border-4 border-[#1a1a1a] shadow-xl">
                                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover grayscale" />
                                      </div>
                                      <h3 className="text-3xl font-bold text-white">{member.name}</h3>
                                      <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mt-2">{member.role}</span>
                                      
                                      <div className="mt-8 max-w-md mx-auto relative">
                                        <div className="absolute top-0 left-0 text-white/5 transform -translate-x-6 -translate-y-6 text-6xl font-serif">"</div>
                                        <p className="text-gray-300 text-lg leading-relaxed relative z-10">{member.bio}</p>
                                      </div>
                                    </ModalContent>
                                  </ModalBody>
                                </Modal>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
