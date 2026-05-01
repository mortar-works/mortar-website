---
title: "Unbalanced Datasets and Service Intelligence"
date: 2026-05-01
image: data-analysis-2.jpg
author: Mortar
description: "Our research highlights how unbalanced datasets cause services to fail the people who need them most; and what it takes to build services that work."
draft: false
pinned: true
category: insight
keywords:
  - AI
  - machine learning
  - behavioural intelligence
  - service design
  - data
  - minority populations
  - DAWN
  - University of Cambridge
tags:
  - AI
  - data
  - service design
  - behavioural intelligence
  - research
---

> The model scores well overall while systematically mischaracterising the people who don't fit the dominant pattern.

Our research using Dawn, one of the UK's fastest AI supercomputers at the University of Cambridge, has been developing models that classify behavioural and psychometric characteristics. In conducting the work we achieved new insights in how services that implement intelligence will fail; leading us to explore what it would take to build ones that don't.

## The problem with majority data

Most real-world datasets are not balanced. People are not evenly distributed across the characteristics a model is trained to recognise. Some behaviours, presentations and profiles are common. Others are rare. And when you train a model on imbalanced data, it learns the majority pattern well and everything else poorly.

This failure is often invisible. Standard performance metrics look healthy because they reflect the majority. The model scores well overall while systematically mischaracterising the people who don't fit the dominant pattern. On paper you see strong results. In practice you have a system that works for most people and quietly fails the rest.

The models we have been working with performed well on the most common profiles and broke down on minority subgroups. Not because the underlying signal wasn't there, but because the training data didn't represent those subgroups adequately, and the standard approach to building models simply amplified the imbalances rather than correcting for them.

Solving this required developing a layered methodology, combining how training data is constructed, how the model weights errors during learning, and how it handles the specific dimensions where imbalance is most severe. The result is a model that achieves genuine performance across the full range of the population, not just the majority of it.

## Why this matters for service design

This is not an abstract technical problem. It shows up in the design of real services constantly, and the consequences are serious.

A referral platform, for example, trained on historical data will learn what a typical successful referral looks like. It will route straightforward cases well. But the people who present differently (whose needs are less common or whose circumstances don't match the majority pattern) are the ones the system is most likely to misread or overlook entirely. These are the people for whom getting the referral right matters most.

The same dynamic applies to screening tools, triage systems, eligibility assessments, outcome monitoring and pretty much anywhere a judgment about a person is being made based on data. If the model was built on majority data without explicit correction for minority populations, it is producing results that look credible at the aggregate level while hiding systematic failures at the individual level.

Service and system design does not always recognise this because feedback loops tend to be very slow and the failures tend to be quiet. There is nobody to effectively flag the person who wasn't referred correctly. Nobody is surfacing the pattern in the cases that were misread. The headline numbers continue to stay clean while the problem compounds underneath them.

## Behaviour, text and the signal that gets missed

One of the specific areas our research explored is what can be learned about people from the way they communicate. Working with text initially we can work to understand how personality, psychological state, communication style, and patterns of thinking are encoded in ways that structured data simply cannot capture.

But extracting that signal reliably is hard. It requires models that understand language at a level of nuance that goes beyond keyword matching or topic classification. And it requires particular care around the minority population problem, because the people whose language patterns are least represented in training data are precisely the ones whose signal gets lost.

This has significant implications for service design. In health and care settings, clinical free text contains information about patients that structured records don't capture. Information that could, if extracted reliably, transform how services understand the people they serve. In government and public services, the language of applications, assessments and casework contains signal about need, circumstance and risk that currently sits unread in document systems at enormous scale. In community and social services, the way people describe their experience in referrals and intake forms tells you things about what kind of support is likely to help that no tick-box form ever could.

The opportunity is significant, and it goes far beyond just text as a potential source of data. Realising this opportunity requires solving the minority population problem first, because any tool that extracts behavioural signal well for the majority and poorly for everyone else will not improve services. It will just entrench existing inequalities in new infrastructure.

## Towards service intelligence that works for everyone

The phrase "service intelligence" is used a lot in our sector and usually refers to dashboards, reporting, data integration. Elements or assets that make existing information more visible and more usable.

However real service intelligence is not just about surfacing what the data already contains in structured form. It is about extracting the signal that currently exists from all our unstructured sources. This could be the language of clinical notes, referrals, case records, community communications. Service intelligence makes this data more useful and available to the people designing and delivering services. It is about building models that characterise populations accurately and about using the to understand how to design interventions that are genuinely responsive to the full range of human needs.

We are developing this work in partnership with colleagues across health, government and community services; exploring how the methodology we have built can be applied to larger datasets, service challenges and populations. The early results are encouraging and the implications are significant.

## What comes next

If you are working on problems where the data you have does not represent everyone equally, where the people most underserved by current systems are also the hardest to see in the data, we would love like to talk with you. To ensure our work is addressing exactly the kind of problems both our communities and our services face.
