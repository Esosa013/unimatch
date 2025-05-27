import { NextResponse } from 'next/server';
import type { University, Preferences, Recommendation } from '@/lib/types'; 
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const preferences: Preferences = await request.json();
    const db = await getDatabase();

    let andConditions: any[] = [];
   if (preferences.preferredCourse) {
  andConditions.push({ courses: { $in: [new RegExp(preferences.preferredCourse, 'i')] } });
}

if (preferences.budgetRange) {
  andConditions.push(
    { 'tuitionFee.min': { $lte: preferences.budgetRange.max } },
    { 'tuitionFee.max': { $gte: preferences.budgetRange.min } }
  );
}

if (preferences.preferredStates && preferences.preferredStates.length > 0) {
  andConditions.push({ state: { $in: preferences.preferredStates } });
}

if (preferences.campusTypePreference && preferences.campusTypePreference !== 'No Preference') {
  andConditions.push({ campusType: preferences.campusTypePreference });
}

const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    const universities = (await db.collection('universities').find(filter).toArray()) as University[];


    const recommendations: Recommendation[] = universities.map((uni) => ({
      university: uni,
      matchScore: calculateMatchScore(uni, preferences),
      matchReasons: generateMatchReasons(uni, preferences),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendation POST error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

function generateMatchReasons(uni: University, preferences: Preferences): string[] {
  const reasons: string[] = [];

  // Course match
  if (preferences.preferredCourse) {
    const courseMatch = uni.courses.some(course =>
      course.toLowerCase().includes(preferences.preferredCourse!.toLowerCase())
    );
    if (courseMatch) {
      reasons.push(`Offers your preferred course: ${preferences.preferredCourse}`);
    }
  }

  // Budget match
  if (preferences.budgetRange) {
    const tuitionInBudget =
      uni.tuitionFee.min <= preferences.budgetRange.max &&
      uni.tuitionFee.max >= preferences.budgetRange.min;
    if (tuitionInBudget) {
      reasons.push(`Tuition fee (₦${uni.tuitionFee.min.toLocaleString()} - ₦${uni.tuitionFee.max.toLocaleString()}) is within your budget`);
    }
  }

  // Location match
  if (preferences.preferredStates?.includes(uni.state)) {
    reasons.push(`Located in your preferred state: ${uni.state}`);
  }

  // Facilities match
  if (preferences.facilitiesImportance) {
    if (preferences.facilitiesImportance.library && uni.libraryCapacity > 1000) {
      reasons.push("Has a large library");
    }
    if (preferences.facilitiesImportance.hostel && uni.hasHostel) {
      reasons.push("Has hostel facilities");
    }
    if (preferences.facilitiesImportance.laboratory && uni.hasLaboratories) {
      reasons.push("Has laboratory facilities");
    }
    if (preferences.facilitiesImportance.sportsComplex && uni.hasSportsComplex) {
      reasons.push("Has a sports complex");
    }
    if (preferences.facilitiesImportance.medicalCenter && uni.hasMedicalCenter) {
      reasons.push("Has a medical center");
    }
  }

  // Campus type match
  if (
    preferences.campusTypePreference &&
    preferences.campusTypePreference !== "No Preference" &&
    preferences.campusTypePreference === uni.campusType
  ) {
    reasons.push(`Campus type matches your preference: ${uni.campusType}`);
  }

  if (reasons.length === 0) {
    reasons.push("General match based on your preferences");
  }

  return reasons;
}

function calculateMatchScore(uni: University, preferences: Preferences): number {
  let score = 0;
  let totalWeight = 0;

  // Course match (weight: 30)
  totalWeight += 30;
  if (preferences.preferredCourse) {
    const courseMatch = uni.courses.some(course =>
      course.toLowerCase().includes(preferences.preferredCourse!.toLowerCase())
    );
    if (courseMatch) score += 30;
  } else {
    score += 15; // partial if no preference
  }

  // Budget match (weight: 25)
  totalWeight += 25;
  if (preferences.budgetRange) {
    const tuitionInBudget =
      uni.tuitionFee.min <= preferences.budgetRange.max &&
      uni.tuitionFee.max >= preferences.budgetRange.min;
    if (tuitionInBudget) score += 25;
  } else {
    score += 12.5;
  }

  // State match (weight: 15)
  totalWeight += 15;
  if (preferences.preferredStates && preferences.preferredStates.length > 0) {
    if (preferences.preferredStates.includes(uni.state)) {
      score += 15;
    }
  } else {
    score += 7.5;
  }

  // Facilities match (weight: 20)
  totalWeight += 20;
  if (preferences.facilitiesImportance) {
    let facilitiesScore = 0;
    const facilitiesCount = Object.values(preferences.facilitiesImportance).filter(Boolean).length;
    if (facilitiesCount > 0) {
      if (preferences.facilitiesImportance.library && uni.libraryCapacity > 1000) facilitiesScore++;
      if (preferences.facilitiesImportance.hostel && uni.hasHostel) facilitiesScore++;
      if (preferences.facilitiesImportance.laboratory && uni.hasLaboratories) facilitiesScore++;
      if (preferences.facilitiesImportance.sportsComplex && uni.hasSportsComplex) facilitiesScore++;
      if (preferences.facilitiesImportance.medicalCenter && uni.hasMedicalCenter) facilitiesScore++;
      
      score += (facilitiesScore / facilitiesCount) * 20;
    } else {
      score += 10; // partial if no facilities preference
    }
  } else {
    score += 10;
  }

  // Campus type match (weight: 10)
  totalWeight += 10;
  if (
    preferences.campusTypePreference &&
    preferences.campusTypePreference !== "No Preference" &&
    preferences.campusTypePreference === uni.campusType
  ) {
    score += 10;
  } else {
    score += 5;
  }

  // Normalize score to percentage
  return (score / totalWeight) * 100;
}
