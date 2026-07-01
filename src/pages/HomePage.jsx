import { motion } from 'framer-motion'
import { Reveal } from '../components/Reveal'
import { RfqForm } from '../components/RfqForm'
import { Seo } from '../components/Seo'
import {
  globalRegions,
  howItWorks,
  industriesServed,
  procurementSupport,
  quoteComparisonRows,
  rfqProgress,
  serviceLines,
  sourcingCategories,
  whyQantara,
} from '../data/siteContent'

export function HomePage() {
  return (
    <>
      <Seo
        title="Qantara Trading | Global Industrial Sourcing & Procurement"
        description="Qantara Trading supports businesses with global sourcing, technical procurement, supplier identification, and export coordination for industrial parts, machinery, OEM spares, and specialist equipment."
      />

      <section className="hero-section" id="home">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <p className="eyebrow">Qantara Trading</p>
            <h1>Global Sourcing for Industrial Parts, Machinery & Specialist Equipment</h1>
            <p className="hero-lead">
              Qantara Trading helps businesses source technical parts, OEM spares, machinery, and
              industrial equipment from reliable suppliers across the UK, Europe, the Middle East,
              Asia, and the US.
            </p>

            <div className="hero-actions">
              <a className="button button--solid" href="#rfq-form">
                Submit an RFQ
              </a>
              <a className="button button--ghost" href="#services">
                View Services
              </a>
            </div>
          </Reveal>

          <Reveal className="hero-visual" delay={0.08}>
            <div className="hero-scene">
              <div className="hero-scene__frame">
                <div className="hero-scene__halo" />
                <div className="hero-orbit hero-orbit--one" />
                <div className="hero-orbit hero-orbit--two" />
                <div className="hero-route hero-route--one" />
                <div className="hero-route hero-route--two" />
                <div className="hero-globe">
                  <div className="hero-globe__core" />
                  <div className="hero-globe__glow" />
                </div>

                <div className="hero-float hero-float--top">
                  <span className="panel-chip">Sourcing coverage</span>
                  <div className="hero-float__regions">
                    {globalRegions.map((region) => (
                      <span key={region}>{region}</span>
                    ))}
                  </div>
                </div>

                <div className="hero-float hero-float--bottom">
                  {rfqProgress.slice(0, 3).map((item, index) => (
                    <div key={item} className="hero-float__row">
                      <span>{index + 1}</span>
                      <div>
                        <strong>{item}</strong>
                        <p>
                          {index === 0
                            ? 'A structured brief with part references, quantities, and delivery needs.'
                            : index === 1
                              ? 'Regional supplier search aligned with technical and commercial fit.'
                              : 'Offer comparison with lead time, documentation, and delivery visibility.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--about" id="about">
        <div className="container about-panel anchor-target">
          <Reveal className="about-panel__copy">
            <p className="eyebrow">About</p>
            <h2>Qantara means bridge.</h2>
            <p className="section-copy">
              Qantara Trading bridges the gap between buyers and reliable global suppliers by
              supporting supplier search, quotation comparison, technical documentation, and
              procurement coordination for industrial requirements.
            </p>
          </Reveal>

          <Reveal className="about-panel__services" delay={0.08}>
            {serviceLines.map((service) => (
              <div key={service} className="about-service-pill">
                {service}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <Reveal className="section-heading anchor-target">
            <p className="eyebrow">What We Source</p>
            <h2>Technical sourcing support built around industrial procurement needs.</h2>
            <p className="section-copy">
              From OEM references and specialist components to export-linked documentation,
              Qantara Trading is designed to support structured industrial RFQs rather than general
              merchandise enquiries.
            </p>
          </Reveal>

          <div className="source-grid">
            {sourcingCategories.map((item, index) => (
              <Reveal key={item.title} className="source-card-wrap" delay={index * 0.04}>
                <motion.article
                  className="source-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <span className="source-card__code">{item.code}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--process">
        <div className="container process-layout">
          <Reveal className="section-heading">
            <p className="eyebrow">How It Works</p>
            <h2>Clear RFQ handling from initial enquiry to supplier offer review.</h2>
          </Reveal>

          <div className="process-grid">
            {howItWorks.map((item, index) => (
              <Reveal key={item.title} className="process-card-wrap" delay={index * 0.05}>
                <motion.article
                  className="process-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <span className="process-card__step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--industries" id="industries">
        <div className="container anchor-target">
          <Reveal className="section-heading">
            <p className="eyebrow">Industries Served</p>
            <h2>Industrial sourcing support for sectors where technical detail and uptime matter.</h2>
          </Reveal>

          <div className="industry-grid">
            {industriesServed.map((industry, index) => (
              <Reveal key={industry.name} className="industry-card" delay={index * 0.04}>
                <h3>{industry.name}</h3>
                <p>{industry.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--why">
        <div className="container why-layout">
          <div>
            <Reveal className="section-heading">
              <p className="eyebrow">Why Qantara Trading</p>
              <h2>Built to make industrial sourcing clearer before you commit to a purchase.</h2>
            </Reveal>

            <div className="trust-grid">
              {whyQantara.map((item, index) => (
                <Reveal key={item.title} className="trust-card-wrap" delay={index * 0.05}>
                  <motion.article
                    className="trust-card"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="comparison-card" delay={0.12}>
            <div className="comparison-card__head">
              <p className="eyebrow">Example Quote Comparison</p>
              <h3>Commercial and technical visibility in one view</h3>
              <p>
                Offers can be reviewed side by side against reference fit, documentation,
                lead time, and delivery terms before approval.
              </p>
            </div>
            <div className="comparison-table">
              <div className="comparison-table__row comparison-table__row--head">
                <span>Criteria</span>
                <span>Supplier A</span>
                <span>Supplier B</span>
                <span>Supplier C</span>
              </div>
              {quoteComparisonRows.map((row) => (
                <div key={row.item} className="comparison-table__row">
                  <span>{row.item}</span>
                  <span>{row.supplierA}</span>
                  <span>{row.supplierB}</span>
                  <span>{row.supplierC}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--support" data-header-theme="dark">
        <div className="container support-layout">
          <div className="support-copy">
            <Reveal className="section-heading section-heading--light">
              <p className="eyebrow">Technical & Commercial Procurement Support</p>
              <h2>Global sourcing support backed by documentation awareness and offer clarity.</h2>
              <p className="section-copy">
                Qantara Trading helps buyers structure enquiries, coordinate supporting documents,
                compare supply routes, and keep procurement conversations commercially focused.
              </p>
            </Reveal>

            <Reveal className="support-visual" delay={0.06}>
              <div className="support-orbit">
                <div className="support-orbit__core" />
                <div className="support-orbit__ring support-orbit__ring--one" />
                <div className="support-orbit__ring support-orbit__ring--two" />
                <div className="support-orbit__route support-orbit__route--one" />
                <div className="support-orbit__route support-orbit__route--two" />
                <div className="support-orbit__route support-orbit__route--three" />
              </div>
            </Reveal>
          </div>

          <div className="support-grid support-grid--interactive">
            {procurementSupport.map((item, index) => (
              <Reveal key={item.title} className="support-card-wrap" delay={index * 0.05}>
                <motion.article
                  className="support-card"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container">
          <Reveal className="final-cta">
            <p className="eyebrow">Final RFQ Call-to-Action</p>
            <h2>Ready to source industrial parts, machinery, or specialist equipment?</h2>
            <p className="section-copy">
              Submit an RFQ with your available reference data and Qantara Trading will respond
              with a structured sourcing review.
            </p>
            <a className="button button--solid" href="#rfq-form">
              Submit an RFQ
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--rfq">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">RFQ</p>
            <h2>Request a quotation for technical parts, OEM spares, or specialist equipment.</h2>
            <p className="section-copy">
              Use the form below to submit your requirement, documentation, and delivery
              information. The backend is structured to route RFQ submissions through the live
              Vercel function for sourcing follow-up.
            </p>
          </Reveal>

          <RfqForm />
        </div>
      </section>
    </>
  )
}
