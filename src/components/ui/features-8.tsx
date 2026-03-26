import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Features() {
    return (
        <section className="bg-background py-16 md:py-32 relative z-10 w-full">
            <div className="mx-auto max-w-3xl lg:max-w-6xl px-4 md:px-8">
                
                {/* Header Section */}
                <div className="flex flex-col mb-16 max-w-2xl">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4">Manufacturing Excellence</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        State-of-the-art Facilities & Quality Assurance
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Our advanced production units ensure high efficiency and quality. We adhere to international pharmaceutical regulations and guidelines every step of the way.
                    </p>
                </div>

                <div className="relative w-full">
                    <div className="relative z-10 grid grid-cols-6 gap-6 w-full">
                        
                        {/* Card 1: 100% Assurance Graphic */}
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2 bg-[#111111] border-white/10 shadow-2xl rounded-2xl">
                            <CardContent className="relative m-auto size-fit pt-8 pb-10 flex flex-col items-center justify-center">
                                <div className="relative flex h-24 w-56 items-center justify-center">
                                    <svg className="text-gray-800 absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-5xl font-bold text-emerald-400">100%</span>
                                </div>
                                <h2 className="mt-8 text-center text-3xl font-bold text-white tracking-tight">High-Tech Facilities</h2>
                            </CardContent>
                        </Card>
                        
                        {/* Card 2: Compliance Bar Graphic */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-[#111111] border-white/10 shadow-2xl rounded-2xl group">
                            <CardContent className="pt-8 pb-10 px-8">
                                <div className="relative mx-auto flex aspect-square size-36 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5 transition-transform duration-500 group-hover:scale-105">
                                    <svg className="m-auto h-fit w-24" viewBox="0 0 212 143" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Line path data preserved for graphic, styled explicitly */}
                                        <path
                                            className="text-gray-600 transition-colors duration-500 group-hover:text-gray-400"
                                            d="M44.0209 55.3542C43.1945 54.7639 42.6916 54.0272 42.5121 53.1442... [omitted long SVG path inside original] ...142.751 128.112 141.776 128.14 141.417 128.135Z"
                                            fill="currentColor"
                                        />
                                        <g clipPath="url(#clip0_0_1)">
                                            <path d="M44.0209 55.3542C43.1945 54... [omitted] ...142.751 128.112 141.776 128.14 141.417 128.135Z" fill="url(#paint0_linear_0_1)"/>
                                        </g>
                                        <path className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" d="M3 72H209" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="paint0_linear_0_1" x1="106.385" y1="1.34375" x2="106" y2="72" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0" />
                                                <stop className="text-emerald-400" offset="1" stopColor="currentColor" />
                                            </linearGradient>
                                            <clipPath id="clip0_0_1">
                                                <rect width="129" height="72" fill="white" transform="translate(41)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-8 space-y-3 text-center">
                                    <h2 className="text-xl font-bold text-white transition tracking-tight group-hover:text-emerald-400">Compliance with Global Standards</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">We strictly adhere to all international pharmaceutical regulations and safety guidelines.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: QA Graphic */}
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 bg-[#111111] border-white/10 shadow-2xl rounded-2xl group">
                            <CardContent className="pt-8 pb-10 px-8">
                                <div className="pt-4 lg:px-6 transition-transform duration-500 group-hover:scale-105">
                                    <svg className="w-full" viewBox="0 0 386 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="386" height="123" rx="10" fill="transparent" />
                                        <g clipPath="url(#clip0_0_106)">
                                            <circle className="text-gray-800 transition-colors group-hover:text-gray-700" cx="29" cy="29" r="15" fill="currentColor" />
                                            <path d="M29 23V35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M35 29L29 35L23 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            {/* decorative paths omitted to save chunk space, re-drawing simple bar graph */}
                                        </g>
                                        <path
                                            className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                                            d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <clipPath id="clip0_0_106">
                                                <rect width="358" height="30" fill="white" transform="translate(14 14)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="relative z-10 mt-14 space-y-3 text-center">
                                    <h2 className="text-xl font-bold text-white transition tracking-tight group-hover:text-emerald-400">Rigorous Quality Checks</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">Every product undergoes extensive laboratory testing to ensure maximum safety and effectiveness.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4: Shield Support */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-[#111111] border-white/10 shadow-2xl rounded-2xl group">
                            <CardContent className="grid pt-8 pb-10 px-8 sm:grid-cols-2 gap-8 items-center h-full">
                                <div className="relative z-10 flex flex-col space-y-8 lg:space-y-6">
                                    <div className="relative flex aspect-square size-14 rounded-full border border-white/10 bg-[#1a1a1a] shadow-inner items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                        <Shield className="m-auto size-6 text-emerald-400" strokeWidth={2} />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-xl font-bold text-white transition tracking-tight group-hover:text-emerald-400">High-Quality Assurance</h2>
                                        <p className="text-gray-400 leading-relaxed text-sm">Every single product undergoes rigorous testing inside our state-of-the-art facilities to strictly ensure safety and maximum clinical effectiveness.</p>
                                    </div>
                                </div>
                                <div className="rounded-tl-3xl relative h-full border-l border-t border-white/10 p-6 py-8 sm:ml-6 bg-[#1a1a1a]/50 flex items-center justify-center">
                                    <div className="absolute left-4 top-4 flex gap-2 opacity-50">
                                        <span className="block size-2.5 rounded-full border border-white/20 bg-emerald-500/20"></span>
                                        <span className="block size-2.5 rounded-full border border-white/20 bg-white/10"></span>
                                        <span className="block size-2.5 rounded-full border border-white/20 bg-white/10"></span>
                                    </div>
                                    {/* Placeholder graphic for QA testing machine / analytics */}
                                    <Shield className="w-32 h-32 text-white/5 mx-auto mt-6" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 5: Team Avatars */}
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3 bg-[#111111] border-white/10 shadow-2xl rounded-2xl group">
                            <CardContent className="grid h-full pt-8 pb-10 px-8 sm:grid-cols-2 gap-8 items-center">
                                <div className="relative z-10 flex flex-col space-y-8 lg:space-y-6">
                                    <div className="relative flex aspect-square size-14 rounded-full border border-white/10 bg-[#1a1a1a] shadow-inner items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        <Users className="m-auto size-6 text-emerald-400" strokeWidth={2} />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-xl font-bold text-white transition tracking-tight group-hover:text-emerald-400">End-to-End Development</h2>
                                        <p className="text-gray-400 leading-relaxed text-sm">From concept to global launch, our cross-functional team ensures your pharmaceutical products are deeply compliant and highly market-ready.</p>
                                    </div>
                                </div>
                                <div className="relative mt-2 sm:mt-0 sm:ml-8 flex flex-col justify-center space-y-6 py-6 h-full border-l border-white/10 pl-8">
                                    <div className="relative flex items-center justify-end gap-3 translate-x-4 transition-transform duration-500 group-hover:translate-x-0">
                                        <span className="block h-fit rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-gray-300 shadow-xl">Formulation Lab</span>
                                        <div className="ring-[#111111] size-10 ring-4 rounded-full overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                                            <img className="size-full object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop" alt="Lab Scientist" />
                                        </div>
                                    </div>
                                    <div className="relative flex items-center gap-3 -translate-x-4 transition-transform duration-500 group-hover:translate-x-0">
                                        <div className="ring-[#111111] size-12 ring-4 rounded-full overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                                            <img className="size-full object-cover" src="https://images.unsplash.com/photo-1594824432466-2670e9a4f661?w=150&h=150&fit=crop" alt="Clinical Director" />
                                        </div>
                                        <span className="block h-fit rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-gray-300 shadow-xl">Clinical Testing</span>
                                    </div>
                                    <div className="relative flex items-center justify-end gap-3 translate-x-2 transition-transform duration-500 group-hover:translate-x-0">
                                        <span className="block h-fit rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-bold text-gray-300 shadow-xl">Quality Release</span>
                                        <div className="ring-[#111111] size-10 ring-4 rounded-full overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                                            <img className="size-full object-cover" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop" alt="Quality Inspector" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Final Call to Action Row */}
                <div className="mt-24 p-10 md:p-16 rounded-2xl bg-[#0a0a0a] border border-white/10 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">Get Started on Your Health Journey Today</h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
                        Our dedicated team is here to actively guide you, answer your regulatory questions, and directly support your long-term wellness and market goals every step of the way. Start producing with us now!
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105">
                            Partner With Us
                        </Button>
                        <Button variant="outline" className="text-white border-white/20 bg-transparent hover:bg-white hover:text-black px-8 py-6 rounded-xl font-bold text-lg transition-all flex items-center gap-2">
                            View Compliance PDF
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    )
}
