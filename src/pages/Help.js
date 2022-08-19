import React, {Component} from 'react';
import {Accordion, AccordionTab} from "primereact/accordion";

export class Help extends Component {
	render() {
		return (
			<div className="p-grid">
				<div className="p-col-12">
					<div className="help-wrapper">
						<div className="help-header">
							<div className="p-grid header-title">
								<div className="p-col-2 icon">
									<i className="fa fa-life-ring"/>
								</div>
								<div className="p-col-9">
									<h1>Frequently Asked Questions</h1>
									<span>Advice and answers from Avalon Team</span>
								</div>
							</div>
						</div>

						<div className="p-grid help-content">
							<div className="p-col-12 p-lg-6">
								<div className="p-col-12 card accordion-card">
									<div className="p-grid card-header">
										<div className="p-col-7 title">
											<div className="p-col-2 icon">
												<i className="fa fa-bookmark"/>
											</div>
											<div className="p-col-9">
												<h1>The Basics</h1>
												<span>3 articles in tihis collection</span>
											</div>

										</div>
										<div className="p-col-5 feedback-buttons">
											<button className="not-helpful"><span role="img" aria-label="bad">👎</span> Not Helpful</button>
											<button className="helpful"><span role="img" aria-label="good">👍</span> Helpful</button>
										</div>
									</div>

									<div className="card-content">
										<div className="questions">
											<Accordion className="sub-accordion" activeIndex={0}>
												<AccordionTab
													header="Which do I need to develop a SaaS application?">
													Lorem ipsum dolor sit amet, consectetur adipiscing elit.
													Praesent pellentesque ligula dolor, pretium tincidunt libero
													sodales in. Integer at eros posuere, elementum felis a, laoreet
													libero. In sed nunc accumsan, dapibus nibh sit amet, aliquet
													ipsum.
												</AccordionTab>
												<AccordionTab
													header="I’m a freelancer/agency. Can I use the item for an end product I’m doing for a client?">
													Aliquam erat volutpat. Nulla hendrerit, arcu non lobortis
													fringilla, ipsum orci condimentum risus, ac hendrerit mauris
													justo eget lectus.
												</AccordionTab>
												<AccordionTab
													header="We’re a reseller, are we able to purchase a license on behalf of our client? ">
													Ut leo tellus, imperdiet tristique turpis eu, eleifend rhoncus
													dolor. Fusce eu feugiat urna. Nullam venenatis nisi varius justo
													ultrices, non aliquam nisi dapibus. Duis viverra nulla ipsum, ac
													laoreet mauris dapibus eu.
												</AccordionTab>
											</Accordion>
										</div>
									</div>
								</div>

								<div className="p-col-12 card accordion-card">
									<div className="p-grid card-header">
										<div className="p-col-7 title">
											<div className="p-col-2 icon">
												<i className="fa fa-bookmark"/>
											</div>
											<div className="p-col-9">
												<h1>Frequently Asked Questions</h1>
												<span>6 articles in tihis collection</span>
											</div>
										</div>
										<div className="p-col-5 feedback-buttons">
											<button className="not-helpful"><span role="img" aria-label="bad">👎</span> Not Helpful</button>
											<button className="helpful"><span role="img" aria-label="good">👍</span> Helpful</button>
										</div>
									</div>

									<div className="card-content">
										<div className="questions">
											<Accordion className="sub-accordion" activeIndex={0}>
												<AccordionTab
													header="Lorem ipsum dolor sit amet, consectetur adipiscing elit ?">
													Vivamus in tortor arcu. Morbi ornare ex mi, sit amet pretium
													nibh sollicitudin eu.
												</AccordionTab>
												<AccordionTab
													header="Sed ut massa accumsan, consequat ligula sit amet, dignissim diam ?">
													Curabitur elit enim, scelerisque at eros ac, sagittis volutpat
													ante. Mauris ac accumsan lorem, in viverra turpis.
												</AccordionTab>
												<AccordionTab
													header=" Vivamus lobortis lacinia eros vel viverra. Vestibulum molestie tortor metus, ac dapibus massa sodales eget ?">
													Donec ut justo sit amet erat eleifend vulputate ut at mi.
												</AccordionTab>
												<AccordionTab
													header="Donec finibus tristique leo, consectetur tincidunt velit ?">
													Maecenas mattis malesuada lobortis. Praesent hendrerit eros
													quam. Praesent volutpat mauris ut dignissim maximus.
												</AccordionTab>
												<AccordionTab header="Praesent suscipit, magna at lacinia tempor ?">
													Velit leo commodo magna, at pharetra risus libero vitae urna.
												</AccordionTab>
												<AccordionTab
													header="Nulla auctor urna eget purus placerat maximus. Interdum ?">
													Et malesuada fames ac ante ipsum primis in faucibus.
												</AccordionTab>
											</Accordion>
										</div>
									</div>
								</div>
							</div>

							<div className="p-col-12 p-lg-6">
								<div className="p-col-12 card api-card">
									<div className="p-grid card-header">
										<div className="p-col-6 title">
											<h2>Avalon Web Application / API</h2>
										</div>
										<div className="p-col-6  status">
											<p>Operational</p>
										</div>
									</div>

									<div className="card-content">
										<div className="progress-bars">
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar fail"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
											<div className="progress-bar"></div>
										</div>
										<div className="days p-col-6">
											30 Days Ago
										</div>
										<div className="today p-col-6">
											Today
										</div>
									</div>
								</div>

								<div className="p-col-12 card blog-card">
									<div className="p-grid card-header">
										<div className="p-col-12 title">
											<div className="p-col-2 icon">
												<i className="fa fa-th-large"/>
											</div>
											<div className="p-col-10">
												<h1>Blog posts</h1>
												<span>4 posts in tihis collection</span>
											</div>
										</div>
									</div>

									<div className="card-content">
										<div className="blog-post">
											<div className="blog-text">
												<h1>Lorem ipsum dolor sit amet?</h1>
												<span>Subtitle of lorem ipsum</span>
											</div>
											<div className="blog-profile">
												<img src="assets/layout/images/extensions/avatar-rachel.jpg"
													 alt="avalon-layout"/>
											</div>
										</div>

										<div className="blog-post">
											<div className="blog-text">
												<h1>Lorem ipsum dolor sit amet?</h1>
												<span>Subtitle of lorem ipsum</span>
											</div>
											<div className="blog-profile">
												<img src="assets/layout/images/extensions/avatar-melissa.jpg"
													 alt="avalon-layout"/>
											</div>
										</div>
										<div className="blog-post">
											<div className="blog-text">
												<h1>Lorem ipsum dolor sit amet?</h1>
												<span>Subtitle of lorem ipsum</span>
											</div>
											<div className="blog-profile">
												<img src="assets/layout/images/extensions/avatar-mike.jpg"
													 alt="avalon-layout"/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
