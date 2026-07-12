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
            Frontier AI is still being built largely inside a small group of
            private companies. They recruit much of the technical talent,
            control the computing infrastructure, develop and evaluate the
            models, and decide how those systems can be accessed.{' '}
            <CitationLink id={13}>
              According to Stanford&apos;s 2025 AI Index, industry produced nearly
              90 percent of the notable AI models identified in 2024.
            </CitationLink>{' '}At the same time, the{' '}
            <CitationLink id={12}>
              U.S. Government Accountability Office has pointed to a serious
              shortage of AI expertise across the federal workforce, made worse
              by slow hiring systems and less competitive pay.
            </CitationLink>{' '}Governments are not without technical capacity,
            but much of the knowledge needed to understand the frontier sits
            outside the institutions expected to govern it.
          </p>
          <p>
            Public authority, meanwhile, is spread across legislatures, defence
            departments, intelligence agencies, courts, and international
            alliances. Here, each institution sees only part of the system.
            Legislators may write the rules, defence departments procure the
            technology, courts determine whether its use is lawful, and
            standards bodies translate broad principles into technical guidance.
            The result here would therefore not be a complete absence of
            governance, but a system in which responsibility is divided among
            institutions that do not always work from the same information.
          </p>
          <p>
            They do not always speak the same language either. Engineers may
            focus on architecture and benchmarks, while policymakers are more
            concerned with authority and jurisdiction. Private firms may be
            thinking about deployment, competition, and contractual obligations.
            These groups can be discussing the same technology while disagreeing
            about what the real problem is.
          </p>
          <p>
            They also work on different timelines. Models can change within
            weeks or months, while judicial review and international
            coordination can take years.{' '}
            <strong>
              It is easy to reduce this to the claim that policy moves too
              slowly, but that misses part of the issue.
            </strong>{' '}Public institutions move cautiously because they are
            expected to follow procedures, justify decisions, assign
            responsibility, and remain accountable to law. Private companies can
            move faster due to less guardrails, but speed does not give them
            public legitimacy either.
          </p>
          <p>
            Now, this becomes more serious when private technical decisions begin
            to carry public consequences. Choices about safeguards, model
            access, cybersecurity, biological capabilities, or military use may
            be made inside companies, even though their effects reach national
            security, civil liberties, critical infrastructure, and public
            safety. Governments can then become dependent on systems they cannot
            fully inspect, and may not be able to replace.
          </p>
          <p>
            The problem is therefore not simply that AI cuts across many
            disciplines, as the institutions responsible for understanding,
            building, and using it are organized separately. For example,
            universities divide knowledge into departments because
            specialization produces depth. These divisions are necessary, but
            they become a problem when they are also the main way we understand
            issues that already move across them.
          </p>
          <p>
            This helps explain why governments have become more interested in
            mission-oriented and cross-sector approaches.{' '}
            <CitationLink id={3}>
              The OECD describes mission-oriented innovation as a way for public
              institutions to bring together actors around problems that no
              single organization can solve alone.
            </CitationLink>{' '}AI governance is already moving in this
            direction.{' '}
            <CitationLink id={4}>
              Stanford&apos;s 2025 AI Index found that legislative mentions of AI
              increased across 75 countries in 2024, while U.S. federal agencies
              issued 59 AI-related regulations that year.
            </CitationLink>{' '}International institutions have also moved from
            broad concern toward more formal rules and standards through the{' '}
            <CitationLink id={5}>OECD AI Principles</CitationLink>,{' '}
            <CitationLink id={6}>
              NIST&apos;s AI Risk Management Framework
            </CitationLink>, and the{' '}
            <CitationLink id={7}>EU AI Act</CitationLink>.
          </p>
          <p>
            Furthermore, these efforts show that AI governance is becoming a
            real policy field. They also show why the field remains difficult to
            navigate. Rules, expertise, infrastructure, and authority are being
            developed in different places, often without a clear view of how they
            fit together.
          </p>
          <p>
            <strong>
              The future is not arranged by university department, but many of
              our knowledge systems still are. The same is true of governments
              and companies.
            </strong>{' '}Specialization gives us rooms full of experts, but very
            few hallways between them.
          </p>
          <p>
            The answer, then, is not to remove those rooms. It is important to
            note that engineers, policymakers, scientists, and governments have
            different roles for good reasons. The task is to make the
            connections between them easier to see, especially where knowledge,
            authority, and responsibility overlap without a reliable institution
            linking them; and that is the gap Omoikane is meant to map.
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
