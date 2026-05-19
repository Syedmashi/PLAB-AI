import { Case, UserStats } from '../types';

export const MOCK_STATS: UserStats = {
  sessionsCompleted: 0,
  accuracy: 0,
  streak: 0,
  totalTime: '0h'
};

export const MOCK_CASES: Case[] = [
  {
    id: 'acs-telephone',
    title: 'Telephone Chest Pain: Possible ACS',
    patientName: 'John Watkins',
    patientAge: 57,
    patientGender: 'Male',
    complaint: 'Central crushing chest pain for 3 hours',
    difficulty: 'Hard',
    category: 'Cardiology / Emergency',
    status: 'Not Started',
    diagnosis: 'Acute coronary syndrome / myocardial infarction until proven otherwise',
    patientAffect: 'frightened, in pain, reluctant to go to hospital unless the doctor explains the danger clearly',
    background: 'You developed severe central crushing chest pain 3 hours ago while making breakfast. It radiates to your left arm and jaw. You feel sweaty and nauseous. You smoke 20 cigarettes/day and have high blood pressure. You are currently at home and worried this could be a heart attack, but you do not want to bother an ambulance unless the doctor is clear and reassuring.',
    keyQuestions: [
      'Confirm identity, location, call-back number, and whether it is a good time to talk for telephone safety',
      'Ask whether chest pain is happening right now',
      'Use SOCRATES: site, onset, character, radiation, associated symptoms, timing, exacerbating/relieving factors, severity',
      'Ask cardiovascular risk factors: smoking, hypertension, diabetes, cholesterol, family history',
      'Ask associated red flags: breathlessness, sweating, nausea/vomiting, collapse, palpitations'
    ],
    redFlags: [
      'Current central crushing chest pain radiating to arm/jaw',
      'Sweating and nausea',
      'Pain within the last 12 hours',
      'Possible myocardial infarction requires urgent assessment'
    ],
    expectedActions: [
      'Stop routine history once ACS red flags are identified',
      'Explain concern for heart attack in simple language',
      'Advise immediate ambulance / emergency department assessment',
      'If no contraindication and available, advise aspirin 300 mg while waiting for ambulance',
      'Safety-net clearly and do not let the patient drive themselves'
    ]
  },
  {
    id: 'pericarditis',
    title: 'Young Adult Chest Pain After Viral Illness',
    patientName: 'Eliot Jones',
    patientAge: 25,
    patientGender: 'Male',
    complaint: 'Sharp central chest pain for 2 days',
    difficulty: 'Medium',
    category: 'Cardiology',
    status: 'Not Started',
    diagnosis: 'Acute pericarditis',
    patientAffect: 'concerned but stable, wants reassurance that it is not a heart attack',
    background: 'You had a flu-like viral illness 10 days ago. For 2 days you have had sharp central chest pain, around 4/10. It is worse when you breathe in and better when you lean forward. You do not have crushing pain, jaw pain, or sweating. You are worried because chest pain sounds serious.',
    keyQuestions: [
      'SOCRATES chest pain history',
      'Ask viral prodrome',
      'Ask positional and pleuritic nature of pain',
      'Screen ACS symptoms and risk factors',
      'Ask breathlessness, fever, palpitations, syncope'
    ],
    redFlags: [
      'Chest pain still needs ECG and clinical assessment',
      'Syncope, severe breathlessness, haemodynamic instability, or suspected ACS would require urgent escalation'
    ],
    expectedActions: [
      'Explain likely pericarditis only after excluding dangerous features',
      'Arrange same-day ECG/troponin or acute assessment depending setting',
      'Discuss analgesia/anti-inflammatory treatment if appropriate',
      'Safety-net for worsening pain, breathlessness, fainting, or persistent fever'
    ]
  },
  {
    id: 'co-headache',
    title: 'Telephone Headache: Possible Carbon Monoxide Exposure',
    patientName: 'Ashley White',
    patientAge: 34,
    patientGender: 'Female',
    complaint: 'Headache for more than one month',
    difficulty: 'Hard',
    category: 'Neurology / Safety',
    status: 'Not Started',
    diagnosis: 'Possible carbon monoxide poisoning',
    patientAffect: 'tired, worried, not initially aware the home environment could be relevant',
    background: 'You have had recurrent headaches for over a month. They are worse at home and improve when you are outside. Your partner has also complained of headaches recently. You use an old gas heater at home. You feel tired and a bit nauseous sometimes. You are calling from home.',
    keyQuestions: [
      'Confirm identity, location, and call-back number because this is a telephone consultation',
      'Ask headache red flags: sudden onset, worst ever, neurological symptoms, fever, neck stiffness, visual symptoms, trauma',
      'Ask cohabitants/pets with similar symptoms',
      'Ask relation to home/work and fuel-burning appliances',
      'Ask pregnancy status where relevant'
    ],
    redFlags: [
      'Multiple people in same home with headache',
      'Headache worse at home and better outside',
      'Possible faulty gas appliance / carbon monoxide exposure'
    ],
    expectedActions: [
      'Advise patient and household to leave the property immediately for fresh air',
      'Advise emergency services/gas emergency line and urgent medical assessment',
      'Do not tell patient to inspect appliance themselves',
      'Safety-net for confusion, collapse, chest pain, breathlessness, pregnancy, or severe symptoms'
    ]
  },
  {
    id: 'migraine',
    title: 'Recurrent Unilateral Headache With Nausea',
    patientName: 'Maya Khan',
    patientAge: 29,
    patientGender: 'Female',
    complaint: 'Recurrent one-sided headaches with nausea',
    difficulty: 'Easy',
    category: 'Neurology',
    status: 'Not Started',
    diagnosis: 'Migraine',
    patientAffect: 'frustrated and worried because headaches affect work',
    background: 'You get recurrent throbbing headaches on one side, often with nausea and sensitivity to light. They last several hours. You sometimes see shimmering lights before the headache. You have no fever, neck stiffness, weakness, collapse, or sudden thunderclap onset. You want to know how to control them.',
    keyQuestions: [
      'Characterise headache pattern and triggers',
      'Ask aura, nausea, photophobia, phonophobia',
      'Screen red flags: thunderclap, neurological deficit, fever/neck stiffness, cancer/immunosuppression, pregnancy, trauma',
      'Ask effect on work/life and medication use',
      'Ask ICE and expectations'
    ],
    redFlags: [
      'New neurological signs, sudden worst headache, meningism, pregnancy/postpartum, or change in pattern require urgent assessment'
    ],
    expectedActions: [
      'Explain migraine in simple terms',
      'Discuss trigger diary and lifestyle measures',
      'Discuss acute treatment and medication-overuse warning',
      'Safety-net for red flag symptoms'
    ]
  },
  {
    id: 'obesity-gynae',
    title: 'Obesity Counselling in Women’s Health',
    patientName: 'Sana Ahmed',
    patientAge: 38,
    patientGender: 'Female',
    complaint: 'Wants advice about weight and women’s health risks',
    difficulty: 'Medium',
    category: 'Gynaecology / Lifestyle',
    status: 'Not Started',
    diagnosis: 'Obesity requiring holistic risk assessment and management plan',
    patientAffect: 'sensitive and slightly embarrassed; responds well to non-judgemental language',
    background: 'You have struggled with weight for years and are worried it may affect your periods, fertility, pregnancy risks, and long-term health. You have tried dieting several times. You want practical options, but you feel judged when clinicians only say “lose weight”.',
    keyQuestions: [
      'Ask permission to discuss weight sensitively',
      'Explore diet, activity, sleep, mood, medications, endocrine symptoms, and previous attempts',
      'Ask women’s health impact: periods, fertility plans, pregnancy history, PCOS symptoms',
      'Assess complications: diabetes, hypertension, sleep apnoea, joint pain',
      'Explore ICE and readiness to change'
    ],
    redFlags: [
      'Rapid unexplained weight gain, endocrine symptoms, severe depression/eating disorder symptoms, pregnancy-related risk'
    ],
    expectedActions: [
      'Use non-stigmatising language and shared decision-making',
      'Offer lifestyle support and realistic goals',
      'Consider referral to weight management services',
      'Discuss medication/surgical options only when appropriate and with criteria',
      'Address women’s health implications and follow-up'
    ]
  },
  {
    id: 'asthma-telephone-child',
    title: 'Telephone Paediatric Asthma Exacerbation',
    patientName: 'Joe Smith',
    patientAge: 42,
    patientGender: 'Male',
    complaint: 'Calling about 9-year-old Luke with worsening shortness of breath',
    difficulty: 'Hard',
    category: 'Paediatrics / Respiratory / Telephone',
    status: 'Not Started',
    diagnosis: 'Acute infective exacerbation of asthma requiring urgent hospital assessment',
    patientAffect: 'very anxious father, needs clear step-by-step emergency advice',
    background: 'You are Luke Smith’s father. Luke is 9 and has asthma. He has had cough, sneezing, and fever for 3 days. In the last 24 hours he has become short of breath. You gave salbutamol and his brown inhaler but there has been no improvement. He is now drowsy, not eating, not active, and sleeping on the sofa. He had a similar hospital episode 6 months ago and was given steroids.',
    keyQuestions: [
      'Confirm caller identity, child identity, address/location, call-back number, and immediate safety',
      'Ask if the child is breathing, able to talk, sitting up, drowsy, blue, or exhausted',
      'Ask inhaler use: salbutamol dose, spacer use, response, preventer adherence, and asthma action plan',
      'Ask fever, cough, wheeze, triggers, previous hospital admission/steroids, allergies, and vaccinations',
      'Ask red flags for alternative diagnoses: rash, swelling lips/face, choking, meningitis rash, urinary symptoms, ear/throat symptoms'
    ],
    redFlags: [
      'Shortness of breath not improving with salbutamol',
      'Drowsiness and reduced activity in a child with asthma',
      'Fever with worsening respiratory symptoms',
      'Previous hospital attendance for asthma exacerbation'
    ],
    expectedActions: [
      'Arrange immediate hospital assessment / ambulance if needed',
      'Advise sitting upright and staying calm',
      'Give blue inhaler via spacer every 30–60 seconds up to 10 puffs while awaiting help',
      'Repeat after 10 minutes if no improvement and ambulance not arrived; call emergency services again',
      'Stay on the phone and advise recovery position if the child loses consciousness'
    ]
  },
  {
    id: 'moderate-depression-risk',
    title: 'Low Mood With Suicide Risk Assessment',
    patientName: 'Daniel Reed',
    patientAge: 36,
    patientGender: 'Male',
    complaint: 'Low mood and poor sleep for 2 months',
    difficulty: 'Medium',
    category: 'Psychiatry / GP',
    status: 'Not Started',
    diagnosis: 'Moderate depressive episode requiring suicide risk assessment and treatment planning',
    patientAffect: 'flat, tired, ashamed, answers risk questions if asked directly and gently',
    background: 'You lost your job 2 months ago. Since then your mood has been low most days. You sleep badly, have low energy, poor concentration, reduced appetite, and feel guilty that you have let your family down. You have had thoughts that things may be easier if you did not wake up, but no fixed plan. You drink more alcohol than before. You are worried people will think you are weak.',
    keyQuestions: [
      'Ask duration, trigger, previous episodes, and mood score',
      'Ask PHQ-2 symptoms: low mood and loss of interest or pleasure',
      'Assess core symptoms: sleep, energy, appetite/weight, guilt, concentration, psychomotor change',
      'Ask direct suicide/self-harm questions including thoughts, frequency, plan, means, intent, protective factors, and immediate safety',
      'Screen differentials and risks: hypothyroid symptoms, mania, psychosis/hallucinations, alcohol/substance use, social support'
    ],
    redFlags: [
      'Suicidal thoughts',
      'Severe self-neglect or active plan/intent',
      'Psychotic symptoms',
      'Alcohol/substance misuse worsening risk'
    ],
    expectedActions: [
      'Acknowledge distress and avoid judgement',
      'If high suicide risk, arrange urgent same-day mental health/crisis support and do not leave patient alone',
      'For moderate depression, discuss talking therapy and possible SSRI with warning about early suicidal risk',
      'Provide crisis contacts/safety plan and follow-up',
      'Assess and involve support network with consent'
    ]
  },
  {
    id: 'ectopic-pregnancy-pain',
    title: 'Early Pregnancy Lower Abdominal Pain',
    patientName: 'Nadia Hussain',
    patientAge: 28,
    patientGender: 'Female',
    complaint: 'Lower abdominal pain and light vaginal bleeding',
    difficulty: 'Hard',
    category: 'Gynaecology / Emergency',
    status: 'Not Started',
    diagnosis: 'Possible ectopic pregnancy until proven otherwise',
    patientAffect: 'scared and in pain, worried about pregnancy and fertility',
    background: 'You are 7 weeks from your last menstrual period and had a positive home pregnancy test. You have one-sided lower abdominal pain and light vaginal bleeding. You feel dizzy when standing. You have no confirmed scan yet. You previously had chlamydia treatment 3 years ago. You want reassurance that the baby is okay.',
    keyQuestions: [
      'Ask pregnancy status, last menstrual period, gestation, pregnancy test, previous scan, and desired pregnancy',
      'Use SOCRATES for abdominal pain including site, onset, severity, radiation, and associated symptoms',
      'Ask vaginal bleeding amount, shoulder-tip pain, dizziness/fainting, collapse, fever, urinary symptoms, and vomiting',
      'Ask ectopic risk factors: previous ectopic, PID/STIs, tubal surgery, fertility treatment, IUCD, smoking',
      'Ask haemodynamic red flags and whether patient is alone / can get emergency help'
    ],
    redFlags: [
      'Positive pregnancy test with unilateral pelvic pain',
      'Vaginal bleeding in early pregnancy',
      'Dizziness/fainting or shoulder-tip pain suggesting intra-abdominal bleeding',
      'No confirmed intrauterine pregnancy on scan'
    ],
    expectedActions: [
      'Explain concern for ectopic pregnancy in simple language',
      'Arrange urgent same-day emergency/gynaecology assessment',
      'Advise not to drive herself if dizzy or severe pain; arrange ambulance if unstable',
      'Check observations, pregnancy test, group and save, beta-hCG, and transvaginal ultrasound in hospital setting',
      'Safety-net for worsening pain, heavy bleeding, collapse, shoulder-tip pain, or fainting'
    ]
  }

];
