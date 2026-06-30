import { motion } from 'framer-motion'
import { Reveal } from '../components/Reveal'
import { RfqForm } from '../components/RfqForm'
import { Seo } from '../components/Seo'
import { globalRegions, industries, sourcingProcess, trustPoints } from '../data/siteContent'

export function HomePage() {
  return (
    <>
      <Seo
        title="Qantara | Global OEM Parts Sourcing"
        description="Qantara supports businesses with OEM machinery parts sourcing, supplier identification, price comparison, lead-time comparison, and international procurement support."
      />

      <section className="hero hero--single">
        <div className="container hero-single__container">
          <Reveal className="hero-single__content">
            <p className="eyebrow">Qantara</p>
            <h1 className="hero-single__title">
              Global OEM Parts.
              <span>Commercial Clarity.</span>
            </h1>
            <p className="hero-single__lead">
              Qantara supports industrial buyers with OEM machinery parts sourcing, supplier
              comparison, lead-time visibility, and procurement coordination across international
              markets.
            </p>
            <div className="hero-single__actions">
              <a className="button button--solid" href="#rfq-form">
                Request a Quote
              </a>
              <a className="button button--ghost" href="#industries">
                Explore Industries
              </a>
            </div>
          </Reveal>

          <Reveal className="hero-single__bar" delay={0.08}>
            <span>UK</span>
            <span>Europe</span>
            <span>Middle East</span>
            <span>Asia</span>
            <span>US</span>
          </Reveal>

        </div>
      </section>

      <section className="section section--about">
        <div className="container about-composition">
          <Reveal id="about" className="about-composition__intro anchor-target">
            <p className="eyebrow">About</p>
            <h2>Procurement support for buyers who need confidence before they commit.</h2>
          </Reveal>

          <Reveal className="about-composition__statement" delay={0.06}>
            <p>
              Qantara is a global sourcing and procurement support company focused on helping
              industrial buyers source OEM machinery parts and industrial components.
            </p>
          </Reveal>

          <Reveal className="about-composition__detail" delay={0.1}>
            <p>
              We help identify supply options, compare pricing and lead times, coordinate technical
              references, and keep part sourcing organised from initial enquiry through procurement
              support.
            </p>
            <p>
              We support buyers across the UK, Europe, Middle East, Asia, and the US while keeping
              communication commercially clear and operationally practical.
            </p>
          </Reveal>

          <Reveal className="about-composition__regions" delay={0.12}>
            {globalRegions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--industries">
        <div className="container industries-composition">
          <Reveal id="industries" className="industries-composition__heading anchor-target">
            <p className="eyebrow">Industries</p>
            <h2>Built for equipment-intensive sectors where uptime matters.</h2>
          </Reveal>

          <div className="industries-grid">
            {industries.map((industry, index) => (
              <Reveal key={industry.name} className="industry-tile-wrap" delay={index * 0.05}>
                <motion.div
                  className="industry-tile"
                  whileHover={{ y: -8, rotateX: 4, rotateY: index % 2 === 0 ? -3 : 3 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <p className="industry-tile__tag">Industry {index + 1}</p>
                  <h3>{industry.name}</h3>
                  <p>{industry.detail}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="sourcing" className="section section--sourcing" data-header-theme="dark">
        <div className="container sourcing-composition">
          <div className="sourcing-composition__visuals">
            <Reveal className="sourcing-globe">
              <div className="sourcing-globe__core" />
              <div className="sourcing-globe__ring sourcing-globe__ring--one" />
              <div className="sourcing-globe__ring sourcing-globe__ring--two" />
              <div className="sourcing-globe__nodes">
                {globalRegions.map((region) => (
                  <span key={region}>{region}</span>
                ))}
              </div>
            </Reveal>

            <Reveal className="sourcing-trust" delay={0.08}>
              {trustPoints.map((item) => (
                <div key={item.title} className="sourcing-trust__item">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </Reveal>
          </div>

          <div className="sourcing-composition__copy">
            <Reveal>
              <p className="eyebrow">Global Reach</p>
              <h2>One page, one sourcing story, and a clearer path from enquiry to delivery.</h2>
              <p className="section-copy">
                Qantara helps buyers move from part request to evaluated sourcing options through a
                structured commercial workflow.
              </p>
            </Reveal>

            <div className="process-list">
              {sourcingProcess.map((step, index) => (
                <Reveal key={step} className="process-step" delay={index * 0.05}>
                  <span className="process-step__count">0{index + 1}</span>
                  <p>{step}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--contact">
        <div className="container contact-composition">
          <Reveal id="contact" className="contact-composition__heading anchor-target">
            <p className="eyebrow">RFQ / Contact</p>
            <h2>Send your requirement and start the sourcing conversation.</h2>
            <p className="section-copy">
              Share the part reference, delivery requirement, and any technical notes you already
              have. The current form is front-end only and ready for backend or CRM integration
              later.
            </p>
          </Reveal>

          <RfqForm />
        </div>
      </section>
    </>
  )
}
