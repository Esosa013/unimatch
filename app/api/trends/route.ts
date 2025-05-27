import { NextResponse } from 'next/server';
import type { University } from '@/lib/types';
import { getDatabase } from '@/lib/mongodb';

export interface TrendingUniversity {
  university: University;
  trendScore: number;
  trendReasons: string[];
  trendCategory: 'Rising Star' | 'Popular Choice' | 'Growing Fast' | 'Well Established';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') as string | null;
    
    const db = await getDatabase();
    const universities = (await db.collection('universities').find({}).toArray()) as University[];

    const trendingUniversities: TrendingUniversity[] = universities
      .map((uni) => ({
        university: uni,
        trendScore: calculateTrendScore(uni),
        trendReasons: generateTrendReasons(uni),
        trendCategory: getTrendCategory(uni),
      }))
      .sort((a, b) => b.trendScore - a.trendScore);

    // Filter by category if specified
    const filteredTrending = category 
      ? trendingUniversities.filter(t => t.trendCategory === category)
      : trendingUniversities;

    return NextResponse.json({
      trending: filteredTrending.slice(0, limit),
      categories: ['Rising Star', 'Popular Choice', 'Growing Fast', 'Well Established'],
      total: filteredTrending.length,
    });
  } catch (error) {
    console.error('Trends GET error:', error);
    return NextResponse.json({ error: 'Failed to get trending universities' }, { status: 500 });
  }
}

function calculateTrendScore(uni: University): number {
  let score = 0;
  const currentYear = new Date().getFullYear();
  const universityAge = currentYear - uni.yearEstablished;

  // Recent establishment bonus (newer universities get higher trend scores)
  if (universityAge <= 10) {
    score += 40; // Very new
  } else if (universityAge <= 20) {
    score += 30; // Relatively new
  } else if (universityAge <= 30) {
    score += 20; // Moderately new
  } else {
    score += 10; // Established but still can be trending
  }

  // Student population factor (moderate size often indicates growth)
  if (uni.studentPopulation >= 5000 && uni.studentPopulation <= 20000) {
    score += 25; // Sweet spot for trending
  } else if (uni.studentPopulation > 20000) {
    score += 20; // Large but established
  } else if (uni.studentPopulation >= 1000) {
    score += 15; // Small but growing
  } else {
    score += 5; // Very small
  }

  // Course diversity (more courses = more appeal)
  const courseCount = uni.courses.length;
  if (courseCount >= 50) {
    score += 20;
  } else if (courseCount >= 30) {
    score += 15;
  } else if (courseCount >= 15) {
    score += 10;
  } else {
    score += 5;
  }

  // Facilities modernization score
  let facilitiesScore = 0;
  if (uni.hasHostel) facilitiesScore += 3;
  if (uni.hasMedicalCenter) facilitiesScore += 4;
  if (uni.hasLaboratories) facilitiesScore += 4;
  if (uni.hasSportsComplex) facilitiesScore += 3;
  if (uni.libraryCapacity > 2000) facilitiesScore += 4;
  
  score += facilitiesScore;

  // Accreditation bonus (quality indicator)
  score += Math.min(uni.accreditation.length * 2, 10);

  // Campus type appeal (Urban and Suburban often more trending)
  if (uni.campusType === 'Urban') {
    score += 8;
  } else if (uni.campusType === 'Suburban') {
    score += 6;
  } else {
    score += 4; // Rural
  }

  // Scholarship availability (attracts more students)
  if (uni.scholarshipAvailable) {
    score += 5;
  }

  // Ranking bonus if available
  if (uni.ranking.national && uni.ranking.national <= 50) {
    score += 15 - (uni.ranking.national / 10); // Top 50 get bonus
  }

  return Math.min(score, 100); // Cap at 100
}

function generateTrendReasons(uni: University): string[] {
  const reasons: string[] = [];
  const currentYear = new Date().getFullYear();
  const universityAge = currentYear - uni.yearEstablished;

  // Age-based reasons
  if (universityAge <= 10) {
    reasons.push('Recently established with modern facilities');
  } else if (universityAge <= 20) {
    reasons.push('Young university with innovative programs');
  }

  // Student population reasons
  if (uni.studentPopulation >= 10000 && uni.studentPopulation <= 25000) {
    reasons.push('Rapidly growing student population');
  }

  // Course diversity
  if (uni.courses.length >= 40) {
    reasons.push('Wide variety of academic programs');
  }

  // Modern facilities
  const modernFacilities = [];
  if (uni.hasMedicalCenter) modernFacilities.push('medical center');
  if (uni.hasLaboratories) modernFacilities.push('modern laboratories');
  if (uni.hasSportsComplex) modernFacilities.push('sports complex');
  if (uni.libraryCapacity > 2000) modernFacilities.push('large library');
  
  if (modernFacilities.length >= 3) {
    reasons.push(`Excellent facilities including ${modernFacilities.slice(0, 2).join(' and ')}`);
  }

  // Location appeal
  if (uni.campusType === 'Urban') {
    reasons.push('Prime urban location with city opportunities');
  } else if (uni.campusType === 'Suburban') {
    reasons.push('Strategic suburban location balancing city access and campus life');
  }

  // Accreditation
  if (uni.accreditation.length >= 3) {
    reasons.push('Multiple accreditations ensuring quality education');
  }

  // Scholarship availability
  if (uni.scholarshipAvailable) {
    reasons.push('Scholarship opportunities available');
  }

  // Strong student-lecturer ratio
  const ratio = parseFloat(uni.studentToLecturerRatio.split(':')[0]);
  if (ratio <= 20) {
    reasons.push('Excellent student-to-lecturer ratio for personalized attention');
  }

  // Ranking
  if (uni.ranking.national && uni.ranking.national <= 30) {
    reasons.push(`High national ranking (#${uni.ranking.national})`);
  }

  // Faculty diversity
  if (uni.faculties.length >= 8) {
    reasons.push('Diverse faculty offerings across multiple disciplines');
  }

  if (reasons.length === 0) {
    reasons.push('Emerging as a popular choice among students');
  }

  return reasons.slice(0, 4); // Limit to top 4 reasons
}

function getTrendCategory(uni: University): 'Rising Star' | 'Popular Choice' | 'Growing Fast' | 'Well Established' {
  const currentYear = new Date().getFullYear();
  const universityAge = currentYear - uni.yearEstablished;
  const trendScore = calculateTrendScore(uni);

  if (universityAge <= 15 && trendScore >= 70) {
    return 'Rising Star';
  } else if (uni.studentPopulation >= 15000 && trendScore >= 65) {
    return 'Popular Choice';
  } else if (universityAge <= 25 && uni.studentPopulation >= 5000 && trendScore >= 60) {
    return 'Growing Fast';
  } else {
    return 'Well Established';
  }
}