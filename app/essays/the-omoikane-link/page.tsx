import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { EssayIndex } from 'app/components/essay-index'
import { FrontierScoreExplorer } from 'app/components/frontier-score-explorer'
import { GapMapMatrix } from 'app/components/gap-map-matrix'
import { PolicyConstellationMap } from 'app/components/policy-constellation-map'
import sourcesData from '../../../public/data/sources.json'

export const metadata: Metadata = {
  title: 'The Omoikane Link',
  description:
    'Can we build a better map of how power, technology, and policy are beginning to connect?',
}

const sections = [
  { id: 'first-collision', title: 'First Collision' },
  { id: 'institutional-gap', title: 'Institutional Gap' },
  { id: 'how-the-platform-would-work', title: 'Platform' },
  { id: 'three-maps', title: 'Three Maps' },
  { id: 'knowledge-map', title: 'Knowledge' },
  { id: 'authority-map', title: 'Authority' },
  { id: 'dependency-map', title: 'Dependency' },
  { id: 'case-study-the-north', title: 'The North' },
  { id: 'strong-pilot', title: 'Pilot' },
  { id: 'what-this-makes-possible', title: 'Possible' },
]

const UPDATED = 'July 2026'

function CitationLink({ children, id }: { children: ReactNode; id: number }) {
  const source = sourcesData.sources.find((item) => item.id === id)

  if (!source) return <>{children}</>

  return (
    <a
      className="citation-link"
      href={source.url}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}

export default function OmoikaneEssay() {
  return (
    <article className="essay-page">
      <header className="essay-hero">
        <p className="essay-kicker">The Omoikane Link</p>
        <h1>Mapping the Global Policy Frontier</h1>
        <p className="essay-subtitle">
          Can we build a better map of how power, technology, and policy are
          beginning to connect?
        </p>
        <p className="essay-meta">
          <span className="author">Sara Kim</span>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span>A 12-minute read</span>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span>Updated {UPDATED}</span>
        </p>
      </header>

      <div className="essay-layout">
        <EssayIndex sections={sections} updated={UPDATED} />

        <div className="essay-body">
          <h2 className="essay-opening-heading" id="first-collision">
            The First Collision
          </h2>
          <p>
            In February 2026, while sitting in my office, I opened a Flipboard
            notification about a confrontation between{' '}
            <CitationLink id={1}>
              Anthropic and the Pentagon in an AP article
            </CitationLink>.
          </p>
          <p>
            The dispute concerned the conditions under which the Department of
            Defense could use Claude. Anthropic refused to
            remove safeguards related to mass domestic surveillance and fully
            autonomous weapons, arguing that current frontier systems remained
            too unreliable for certain high-stakes uses. Pentagon officials
            responded that a private company should not determine how the
            military could lawfully use technology it had purchased. Both sides
            claimed to be protecting national security. Both institutions
            possessed something the other could not easily replace:{' '}
            <strong>
              the government held public authority, while Anthropic held
              technical expertise and control over the system.
            </strong>
          </p>
          <p>
            At first, I read it as a dispute over one government contract, but it
            exposed a much larger institutional problem.{' '}
            <strong>AI is being built in one world and governed in another.</strong>{' '}
            The people developing the systems, the people legally empowered to
            make public decisions, and the people who will bear the consequences
            of failure are often not the same people.
          </p>
          <p>
            As a student, I had already watched ChatGPT and Claude develop at a
            pace that was difficult to reconcile with the slower world of laws,
            public institutions, and university disciplines. Their rapid
            improvement made me wonder whether an equivalent policy world
            existed around them. But the better question was not whether AI
            policy existed. It clearly did. The real questions were more
            difficult:
          </p>
          <ol className="essay-questions">
            <li>
              <em>Who has legal or political authority?</em>
            </li>
            <li>
              <em>Who controls the technology or infrastructure?</em>
            </li>
            <li>
              <em>
                Why is there no reliable institution connecting these groups?
              </em>
            </li>
          </ol>
          <p>
            The Anthropic-Pentagon dispute gave institutional form to a problem I
            had previously understood only in the abstract. Governments cannot
            govern advanced AI without access to technical knowledge. AI
            companies cannot independently determine the public rules governing
            defense, security, surveillance, or biological risk. And neither
            side can simply replace the other. Yet, the institutions connecting
            them remain fragmented, temporary, and frequently adversarial.
          </p>
          <p>
            This is where the thought process behind Omoikane began for me. In
            Shinto tradition, Omoikane is associated with collective wisdom and
            counsel, bringing together the thoughts of many deities when no
            single participant possesses the entire answer. The significance of
            the name is not that one intelligence knows everything. It is that
            dispersed knowledge must be assembled before responsible decisions
            can be made. The main claim is that the central governance problem of
            frontier AI is the separation of technical knowledge and public
            accountability. The greater the distance between who knows, who
            decides, and who bears the risk, the more likely AI policy is to
            become late, adversarial, or technically unworkable. Omoikane is
            proposed as a policy-intelligence platform for mapping that distance
            across government, industry, universities, and civil society,
            beginning with cybersecurity, military AI, and biosecurity.
          </p>

          <h2 id="institutional-gap">The Institutional Gap</h2>
          <p>
            Many policy problems are now organized around systems rather than
            single disciplines. AI governance depends on computer science, law,
            national security, labour policy, civil liberties, infrastructure,
            and international competition. Arctic security depends on climate
            science, naval strategy, undersea infrastructure, critical minerals,
            Indigenous governance, and Russia-NATO relations.{' '}
            <CitationLink id={2}>
              These issues do not fit neatly into one department, agency, or
              professional field.
            </CitationLink>
          </p>
          <p>
            Disciplinary boundaries still matter. Universities divide knowledge
            into departments because specialization produces depth. Governments
            divide work into agencies because responsibility has to be assigned.
            Companies separate engineering, compliance, legal, and strategy
            teams because each function requires different expertise. The
            problem begins when these divisions become the main way we
            understand issues that are already moving across them. Omoikane
            begins from this mismatch: the world is producing cross-disciplinary
            problems faster than many of our knowledge systems can map them.
          </p>

          <details className="soft-note">
            <summary>Why institutions still think in separate fields</summary>
            <p>
              Most institutions are built around specialization. Universities
              organize knowledge into departments, governments divide
              responsibility across agencies, and companies separate technical,
              legal, policy, and commercial teams. This structure is useful
              because it creates expertise and accountability. The weakness is
              that many emerging policy problems do not respect those
              boundaries. AI governance, semiconductor policy, Arctic security,
              biosecurity, and defense innovation all require people from
              different fields to understand the same problem at the same time.
              Omoikane does not argue against specialization. It shows where
              specialized fields need to be connected.
            </p>
          </details>

          <p>
            The basic claim behind Omoikane is that important policy frontiers
            often form where technical change, geopolitical pressure, legal
            uncertainty, and institutional fragmentation meet. These are the
            areas where the language of one field is no longer enough. A lawyer
            may understand regulation but not model architecture. An engineer
            may understand technical performance but not public accountability.
            A policymaker may understand risk but not the infrastructure that
            creates it. A student may see the topic but not yet see the
            surrounding ecosystem.
          </p>
          <p>
            This is also why governments have become more interested in
            mission-oriented and cross-sector approaches.{' '}
            <CitationLink id={3}>
              The OECD describes mission-oriented innovation as a way for the
              public sector to convene and coordinate actors around complex
              problems that cannot be solved by individual actors alone.
            </CitationLink>{' '}Omoikane would apply a similar
            logic to research and policy navigation. It would not treat policy
            fields as isolated lanes. It would show where actors, documents,
            technical systems, and public decisions are starting to converge.
          </p>
          <p>
            AI governance is a clear example.{' '}
            <CitationLink id={4}>
              Stanford&apos;s 2025 AI Index reports that legislative mentions of
              AI rose across 75 countries in 2024, while U.S. federal agencies
              issued 59 AI-related regulations that year.
            </CitationLink>{' '}International institutions are also trying to
            keep pace:{' '}
            <CitationLink id={5}>
              the OECD AI Principles were adopted in 2019 and updated in 2024
            </CitationLink>,{' '}
            <CitationLink id={6}>
              NIST created an AI Risk Management Framework to help organizations
              manage AI risks
            </CitationLink>, and{' '}
            <CitationLink id={7}>
              the European Commission describes the EU AI Act as the first legal
              framework on AI
            </CitationLink>. Together, these
            examples show that AI governance has moved beyond general concern
            and into a more formal policy field with rules, standards,
            measurement problems, and institutional competition.
          </p>
          <p>
            Strategic technology policy shows the same pattern. Semiconductor
            policy is no longer only about manufacturing chips.{' '}
            <CitationLink id={8}>
              Through CHIPS for America, the U.S. government links semiconductor
              production to research and development, workforce capacity,
              supply-chain resilience, and national competitiveness.
            </CitationLink>{' '}Arctic policy also shows convergence in another
            setting.{' '}
            <CitationLink id={9}>
              The U.S. National Strategy for the Arctic Region connects security,
              climate change, economic development, Indigenous livelihoods, and
              international law into one policy agenda.
            </CitationLink>{' '}These are
            different issue areas, but they point to the same problem: policy
            knowledge is being produced across institutions faster than most
            users can organize it.
          </p>

          <h2 id="how-the-platform-would-work">
            How the Platform Would Work
          </h2>
          <p>
            Omoikane would collect and map documents from several kinds of
            institutions, including academic journals, think tanks, government
            strategies, parliamentary reports, international organizations,
            courts, standards bodies, public speeches, technical reports, and
            major policy briefs. Each document would become a point on a map.
            Similar documents would sit near each other, while bridges would
            show where one field begins to connect with another.
          </p>
          <p>
            The first version should stay focused. A platform that tries to map
            all of global affairs from the beginning would become too broad to
            be useful. A stronger pilot would begin with one frontier ecosystem
            where the problem is already visible: AI, security, and strategic
            technology. That cluster is large enough to matter, but focused
            enough to test whether the map actually helps users think better.
          </p>

          <h2 id="three-maps">The Three Maps</h2>
          <p className="map-lead">
            The platform would organize the field through three maps. These maps
            are not separate products. They are different ways of reading the
            same policy ecosystem.
          </p>

          <section
            className="map-section"
            id="knowledge-map"
            aria-labelledby="knowledge-map-h"
          >
            <div className="map-head">
              <h3 id="knowledge-map-h">
                <span className="map-index">1.</span> The Knowledge Map
              </h3>
            </div>
            <p className="map-prompt">
              <strong>
                <em>Who can actually decide?</em>
              </strong>
            </p>
            <p className="map-lead">
              Authority can include the power to regulate, procure, deploy,
              restrict, investigate, fund, audit, prosecute, or establish
              standards. These powers rarely belong to the same institution.
            </p>
            <p className="map-lead">
              In cybersecurity, a government agency may issue guidance or
              investigate an attack, while private companies still control the
              affected networks and infrastructure. In military AI, elected
              governments and defence institutions hold authority over military
              operations, but contractors and AI companies may control the
              systems through which those decisions are carried out. In
              biosecurity, authority may be divided among health agencies,
              research regulators, laboratories, security institutions, and
              international bodies.
            </p>
            <p className="map-lead">
              The Anthropic-Pentagon dispute belongs partly on this map. The
              Pentagon argued that military decisions belonged to the state.
              Anthropic accepted that principle but argued that it should not be
              required to provide a system for uses it considered technically
              unreliable or incompatible with basic safeguards. The dispute was
              not simply about whether the military or the company had authority.
              It was about which kind of authority applied to which decision.
            </p>
            <FrontierScoreExplorer />
            <p className="tool-caption">
              Adjust the weights to test how knowledge, authority, dependency,
              and coordination change the ranking.
            </p>
          </section>

          <section
            className="map-section"
            id="authority-map"
            aria-labelledby="authority-map-h"
          >
            <div className="map-head">
              <h3 id="authority-map-h">
                <span className="map-index">2.</span> The Authority Map
              </h3>
            </div>
            <p className="map-prompt">
              <strong>
                <em>Who depends on whom?</em>
              </strong>
            </p>
            <p className="map-lead">
              A government may possess legal authority while depending on a
              private company for access to a frontier model, cloud
              infrastructure, computing capacity, technical maintenance, or
              system evaluation. A private company may depend on government
              contracts, public research, regulation, security clearances, or
              access to government data.
            </p>
            <p className="map-lead">
              In cybersecurity, governments and infrastructure operators often
              rely on private firms to detect vulnerabilities and share threat
              information.{' '}
              <CitationLink id={11}>
                CISA&apos;s Joint Cyber Defense Collaborative was created around
                this basic reality
              </CitationLink>, providing a mechanism for government and industry
              to coordinate on cybersecurity threats.
            </p>
            <p className="map-lead">
              In military AI, defence institutions may rely on commercial models
              and cloud systems that they do not fully own. The Anthropic dispute
              demonstrated what happens when a government becomes operationally
              interested in a system while the supplier retains control over
              important conditions of use.
            </p>
            <p className="map-lead">
              In biosecurity, AI companies may depend on external scientists to
              evaluate biological capabilities, while public-health institutions
              may depend on private laboratories, commercial data, and
              proprietary AI tools.
            </p>
            <p className="map-lead">
              The Dependency Map would make these relationships visible because
              dependency can shape decisions as strongly as law does.
            </p>
            <PolicyConstellationMap />
            <p className="tool-caption">
              Select any point to read how influence, information, and funding
              move through it. Filter to institutions or funding links to see who
              holds the field together.
            </p>
          </section>

          <section
            className="map-section"
            id="dependency-map"
            aria-labelledby="dependency-map-h"
          >
            <div className="map-head">
              <h3 id="dependency-map-h">
                <span className="map-index">3.</span> The Dependency Map
              </h3>
            </div>
            <p className="map-prompt">
              <strong>
                <em>Where do these institutions meet?</em>
              </strong>
            </p>
            <p className="map-lead">
              The answer may include procurement contracts, model-use policies,
              reporting requirements, safety evaluations, licensing systems,
              technical standards, joint research programs, advisory bodies,
              red-team exercises, and public-private partnerships.
            </p>
            <p className="map-lead">
              These interfaces translate public goals into technical
              requirements. A law may state that an AI system must be safe or
              accountable, but that principle must eventually become an
              evaluation, an access control, a reporting process, a contract
              clause, or an operational restriction.{' '}
              <CitationLink id={6}>
                NIST&apos;s AI Risk Management Framework is one example of an
                institution
              </CitationLink>{' '}trying to create a shared structure that
              different organizations can use when designing, deploying, and
              evaluating AI systems.
            </p>
            <p className="map-lead">
              The Anthropic-Pentagon confrontation can be understood as a
              contested interface. The contract connected a private model to a
              public mission, but it did not produce agreement over who could
              define the acceptable conditions of use.
            </p>
            <GapMapMatrix />
            <p className="tool-caption">
              Fields far below the diagonal draw heavy technical activity with
              limited policy authority or accountability. Hover or select any
              point to read the drivers behind its position.
            </p>
          </section>

          <h2 id="case-study-the-north">Case Study: The North</h2>
          <p>
            Imagine a student wants to study Arctic security. A normal search
            can return articles about Russia, NATO, climate change, shipping
            routes, Indigenous governance, and naval strategy. Those sources are
            useful, but they do not automatically show how the field is changing
            or where a student might contribute something new.
          </p>
          <p>
            Omoikane would show Arctic security as a cluster connected to NATO
            strategy, submarine deterrence, undersea infrastructure, critical
            minerals, climate security, Russia policy, China&apos;s polar
            interests, maritime surveillance, and autonomous maritime systems.
            The platform would not present these as disconnected topics. It
            would show how they sit inside one widening policy ecosystem.
          </p>
          <p>
            The map could then point to fast-growing related topics such as
            undersea infrastructure, Arctic surveillance, critical minerals, and
            NATO northern defence. It might also identify a knowledge gap:
            public-facing work on Arctic policy often does not clearly connect
            security debates with undersea infrastructure, autonomous systems,
            and resource competition. That gives the student a stronger research
            direction than a plain list of sources.
          </p>

          <h2 id="strong-pilot">A Strong Pilot</h2>
          <p>
            The strongest pilot would map the cluster around AI, security, and
            strategic technology. This would include AI governance,
            cybersecurity, military AI, AI safety, compute governance, export
            controls, semiconductor policy, supply chains, critical minerals,
            economic security, defence innovation, Arctic security, undersea
            infrastructure, autonomous maritime systems, and strategic
            foresight.
          </p>
          <p>
            This cluster works because several worlds are already colliding
            there: technology, defence, economics, law, and international
            relations. AI systems are developing quickly. Governments are trying
            to regulate systems they often do not fully understand. Military
            planners are thinking about autonomy, undersea warfare, and
            deterrence in settings where technical details matter. Universities
            and think tanks are producing research, but that research does not
            always reach the institutions making decisions.
          </p>
          <p>
            The theory behind Omoikane is simple: a field becomes politically
            important when new technology creates new capabilities, geopolitical
            pressure raises the stakes, and existing institutions are too
            fragmented to respond clearly. Omoikane would make those mismatches
            easier to see by showing where the map is crowded, where language
            breaks down, where research is missing, and where decisions are
            being made before the relevant communities have learned how to talk
            to one another.
          </p>

          <h2 id="what-this-makes-possible">What This Makes Possible</h2>
          <p>
            The world does not need another database of documents. It needs
            better ways to understand how ideas move. Omoikane would map the
            global policy frontier by identifying emerging ideas, tracing how
            they move across institutions, and exposing gaps between technical
            knowledge and public decision-making.
          </p>
          <p>
            For students, it would help identify research opportunities before a
            field becomes crowded. For policymakers, it would show where
            expertise is missing. For technical experts, it would show how their
            work connects to law, security, economics, and governance. For
            institutions, it would show where silos need to be bridged rather
            than ignored.
          </p>
          <p>
            The goal is to make the structure of global policy easier to see. If
            people can understand how an issue is forming, who is shaping it,
            and where the gaps are, they can ask better questions before the
            issue becomes impossible to avoid.
          </p>
        </div>
      </div>
    </article>
  )
}
