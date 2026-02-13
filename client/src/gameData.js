export const STAGES = [
    { id: 1, name: "Semester 1", teacher: "Arslan Tariq Andar Ki Baat: (Mute Button Ki Talaash)", difficulty: 0.8 },
    { id: 2, name: "Semester 2", teacher: "Fazain ul Mustafa Andar_Ki_Baat:(Mood_Ka_Koi_Bharosa_Nahi)", difficulty: 1.0 },
    { id: 3, name: "Semester 3", teacher: "Ahtar Ikhlaq Andar_Ki_Baat:(Code_Hard_Niyyat_Soft)", difficulty: 1.2 },
    { id: 4, name: "Semester 4", teacher: "Ammar Nasir Andar_Ki_Baat:(Lab_Ka_Romeo)", difficulty: 1.0 },
    { id: 5, name: "Semester 5", teacher: "Faheem Andar_Ki_Baat:(Attention_Ka_Zaalim)", difficulty: 1.0 },
    { id: 6, name: "Semester 6", teacher: "Kainat Andar_Ki_Baat:(Anti_Shadi_Commander)", difficulty: 1.0 },
    { id: 7, name: "Semester 7", teacher: "Iqra Tariq Andar_Ki_Baat:(Meri_Marzi)", difficulty: 1.0 },
    { id: 8, name: "Semester 8", teacher: "Aneeka Shayan Andar_Ki_Baat:(Kuch ni bola ga)", difficulty: 1.0 },
];

export const TEACHER_ATTACKS = [
    { name: "Class Participation", damage: 5, type: "stress" },
    { name: "Pop Quiz", damage: 10, type: "stress" },
    { name: "Assignment", damage: 15, type: "energy" },
    { name: "Group Project", damage: 15, type: "stress" },
    { name: "Midterm Exam", damage: 20, type: "stress" },
];

export const STUDENT_ACTIONS = [
    { id: 'attack_ontime', name: "On-Time Submission", type: "attack", cost: 5, damage: 20, stat: "energy" },
    { id: 'attack_extra', name: "Extra Credit", type: "attack", cost: 15, damage: 35, stat: "energy" },
    { id: 'attack_smart', name: "Smart Question", type: "attack", cost: 0, damage: 10, stat: "energy" },
    { id: 'defend_notes', name: "Take Notes", type: "defense", cost: 5, effect: "reduce_stress", value: 20, stat: "energy" },
    { id: 'defend_sleep', name: "Power Nap", type: "heal", cost: 0, effect: "restore_energy", value: 40, stat: "time" },
];
