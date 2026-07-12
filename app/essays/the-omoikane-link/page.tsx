import type { Metadata } from 'next'
import { EssayIndex } from 'app/components/essay-index'
import { FrontierScoreExplorer } from 'app/components/frontier-score-explorer'
import { GapMapMatrix } from 'app/components/gap-map-matrix'
import { PolicyConstellationMap } from 'app/components/policy-constellation-map'
import { SourceNotes } from 'app/components/source-notes'

export const metadata: Metadata = {
  title: 'The Omoikane Link',
  description:
    'Can we build a better map of how power, technology, and policy are beginning to connect?',
}

const sections = [
  { id: 'map-problem', title: 'Map Problem' },
  { id: 'what-omoikane-sees', title: 'What It Sees' },
  { id: 'how-the-platform-would-work', title: 'Platform' },
  { id: 'four-coordinates', title: 'Coordinates' },
  { id: 'frontier-map', title: 'Frontier' },
  { id: 'bridge-map', title: 'Bridge' },
  { id: 'gap-map', title: 'Gap' },
  { id: 'institution-map', title: 'Institutions' },
  { id: 'beyond-search', title: 'Beyond Search' },
  { id: 'case-study-the-north', title: 'The North' },
  { id: 'strong-pilot', title: 'Pilot' },
  { id: 'what-this-makes-possible', title: 'Possible' },
  { id: 'references-heading', title: 'References' },
]

const UPDATED = 'July 2025'

function Citation({ id }: { id: number }) {
  return (
    <sup className="citation" id={`ref-back-${id}`}>
      <a href={`#ref-${id}`} aria-label={`Reference ${id}`}>
        {id}
      </a>
    </sup>
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
          <p>
            Most people now have access to more policy information than they can
            reasonably use. Governments publish strategies, universities produce
            research, think tanks release reports, courts issue decisions,
            international organizations write standards, and companies shape
            technological fields before public institutions fully understand
            what has changed. The hard problem is no longer only finding
            information. It is understanding how separate pieces of information
            fit together.
          </p>
          <p>
            This matters most in fields where technology, law, security, and
            economics are beginning to overlap. A student interested in AI
            governance may start with regulation or model safety, then quickly
            run into cybersecurity, export controls, semiconductor supply
            chains, military use, data infrastructure, and China policy. A
            researcher working on Arctic security may begin with Russia or NATO,
            then encounter climate science, undersea infrastructure, critical
            minerals, submarine deterrence, maritime surveillance, and
            Indigenous governance. These connections are not random. They show
            that many important policy fields are becoming difficult to
            understand through one discipline alone.
          </p>
          <p>
            Omoikane is a proposed research platform for making those
            connections easier to see. It would help users understand where
            policy attention is growing, which fields are starting to overlap,
            which institutions are shaping the conversation, and where technical
            knowledge and public decision-making are failing to meet. The
            platform would be useful for students, researchers, analysts,
            policymakers, and technical experts who need a clearer view of a
            field before it becomes too crowded or too urgent to study carefully.
          </p>
          <p>
            The platform would work as an interactive map of emerging global
            policy fields. A user could begin with a topic such as AI
            governance, Arctic security, semiconductor policy, or biosecurity,
            then see the surrounding institutions, related fields, major
            documents, and unresolved questions. A search engine returns sources
            that match a query. Omoikane would show how those sources sit inside
            a wider field of power, knowledge, regulation, and technical change.
          </p>

          <h2 id="map-problem">The Map Problem</h2>
          <p>
            Many policy problems are now organized around systems rather than
            single disciplines. AI governance depends on computer science, law,
            national security, labour policy, civil liberties, infrastructure,
            and international competition. Arctic security depends on climate
            science, naval strategy, undersea infrastructure, critical minerals,
            Indigenous governance, and Russia-NATO relations. These issues do
            not fit neatly into one department, agency, or professional field.
            <Citation id={1} />
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

          <h2 id="what-omoikane-sees">What Omoikane Sees</h2>
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
            mission-oriented and cross-sector approaches. The OECD describes
            mission-oriented innovation as a way for the public sector to
            convene and coordinate actors around complex problems that cannot be
            solved by individual actors alone. Omoikane would apply a similar
            logic to research and policy navigation. It would not treat policy
            fields as isolated lanes. It would show where actors, documents,
            technical systems, and public decisions are starting to converge.
            <Citation id={2} />
          </p>
          <p>
            AI governance is a clear example. Stanford&apos;s 2025 AI Index
            reports that legislative mentions of AI rose across 75 countries in
            2024, while U.S. federal agencies issued 59 AI-related regulations
            that year.
            <Citation id={3} /> International institutions are also trying to
            keep pace: the OECD AI Principles were adopted in 2019 and updated
            in 2024, NIST created an AI Risk Management Framework to help
            organizations manage AI risks, and the European Commission describes
            the EU AI Act as the first legal framework on AI. Together, these
            examples show that AI governance has moved beyond general concern
            and into a more formal policy field with rules, standards,
            measurement problems, and institutional competition.
            <Citation id={4} />
            <Citation id={5} />
            <Citation id={6} />
          </p>
          <p>
            Strategic technology policy shows the same pattern. Semiconductor
            policy is no longer only about manufacturing chips. Through CHIPS
            for America, the U.S. government links semiconductor production to
            research and development, workforce capacity, supply-chain
            resilience, and national competitiveness.
            <Citation id={7} /> Arctic policy also shows convergence in another
            setting. The U.S. National Strategy for the Arctic Region connects
            security, climate change, economic development, Indigenous
            livelihoods, and international law into one policy agenda. These are
            different issue areas, but they point to the same problem: policy
            knowledge is being produced across institutions faster than most
            users can organize it.
            <Citation id={8} />
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

          <h2 id="four-coordinates">The Four Coordinates</h2>
          <p className="map-lead">
            The platform would organize the map through four coordinates. These
            coordinates are not separate products. They are different ways of
            reading the same policy ecosystem.
          </p>

          <section
            className="map-section"
            id="frontier-map"
            aria-labelledby="frontier-map-h"
          >
            <div className="map-head">
              <h3 id="frontier-map-h">
                <span className="map-index">1.</span> The Frontier Map
              </h3>
            </div>
            <p className="map-lead">
              The Frontier Map would show where attention is accelerating. It
              would help a user see whether a topic is growing because more
              people are publishing on it, because governments are beginning to
              regulate it, because new technical language is emerging, or because
              the topic is starting to connect fields that were previously
              separate. A frontier score could combine momentum, novelty, policy
              salience, and bridge importance. The score would not decide what
              matters on its own. It would give users a structured way to notice
              which questions are becoming harder to ignore.
            </p>
            <FrontierScoreExplorer />
            <p className="tool-caption">
              Adjust the weights to reflect different priorities. Raising Policy
              Salience surfaces topics already on policymakers&apos; desks, while
              raising Novelty brings earlier, faster-moving signals to the top.
            </p>
          </section>

          <section
            className="map-section"
            id="bridge-map"
            aria-labelledby="bridge-map-h"
          >
            <div className="map-head">
              <h3 id="bridge-map-h">
                <span className="map-index">2.</span> The Bridge Map
              </h3>
            </div>
            <p className="map-lead">
              The Bridge Map would show how fields connect. A user searching AI
              governance might be led toward cybersecurity, export controls,
              semiconductor policy, military AI, and China strategy. A user
              studying Arctic security might be led toward submarine deterrence,
              undersea infrastructure, critical minerals, maritime surveillance,
              and NATO planning. This matters because many policy frontiers
              emerge at the intersection of fields. NATO&apos;s Defence
              Innovation Accelerator for the North Atlantic, for example, exists
              to connect emerging and disruptive technologies with collective
              defence and security needs. That is the kind of
              public-private-technical bridge Omoikane would make easier to see.
              <Citation id={9} />
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
            id="gap-map"
            aria-labelledby="gap-map-h"
          >
            <div className="map-head">
              <h3 id="gap-map-h">
                <span className="map-index">3.</span> The Gap Map
              </h3>
            </div>
            <p className="map-lead">
              The Gap Map would identify places where policy attention and
              technical knowledge are not aligned. Some fields may have strong
              technical activity but weak public understanding. Other fields may
              attract political attention before the relevant science,
              engineering, or standards work has been absorbed by
              decision-makers. The point would not be to claim that nobody is
              working on a topic. The point would be to show where communities
              are not communicating well enough.
            </p>
            <p className="map-lead">
              Military AI is a good example of this kind of gap. Technical work,
              defense planning, legal debate, and public concern all exist, but
              they do not always speak to each other in a clear way. Arctic
              security has a similar problem for a wider audience. It sits at the
              intersection of climate, infrastructure, naval strategy, Russia
              policy, critical minerals, and Indigenous governance, yet many
              people encounter it only as a regional issue. A map that makes
              these gaps visible would help users ask sharper research and policy
              questions.
            </p>
            <GapMapMatrix />
            <p className="tool-caption">
              Fields far below the diagonal draw heavy technical work with little
              policy attention. Hover or select any point to read the drivers
              behind its position.
            </p>
          </section>

          <section
            className="map-section"
            id="institution-map"
            aria-labelledby="institution-map-h"
          >
            <div className="map-head">
              <h3 id="institution-map-h">
                <span className="map-index">4.</span> The Institution Map
              </h3>
            </div>
            <p className="map-lead">
              The Institution Map would show who is shaping a field. Policy
              influence does not move only through academic citations. It also
              moves through hearings, standards, strategy papers, procurement
              programs, legal decisions, funding streams, and public speeches. A
              think tank can shape government strategy. A private lab can shape
              AI governance. A standards body can influence regulation. An
              international organization can spread a concept across countries. A
              university can produce the research base while still struggling to
              connect that research to implementation. The Institution Map would
              make those pathways easier to follow.
            </p>
          </section>

          <h2 id="beyond-search">Beyond the Search Bar</h2>
          <p>
            Google Scholar, government databases, and normal search engines are
            useful because they help users find sources. Omoikane would serve a
            different function. It would help users understand the structure of
            a policy field once the sources begin to pile up.
          </p>

          <table className="comparison">
            <thead>
              <tr>
                <th>Search tools help answer</th>
                <th>Omoikane would help answer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>What has been published on this topic?</td>
                <td>Where is this topic going?</td>
              </tr>
              <tr>
                <td>Which sources match my search terms?</td>
                <td>What does this topic connect to?</td>
              </tr>
              <tr>
                <td>Which papers cite each other?</td>
                <td>Which institutions are shaping the field?</td>
              </tr>
              <tr>
                <td>Where can I find documents?</td>
                <td>
                  Where are the gaps between technical knowledge and policy
                  action?
                </td>
              </tr>
              <tr>
                <td>Which sources seem influential?</td>
                <td>
                  Which ideas are moving from research into public
                  decision-making?
                </td>
              </tr>
            </tbody>
          </table>

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

          <SourceNotes />
        </div>
      </div>
    </article>
  )
}
