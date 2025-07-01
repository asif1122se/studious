export interface GradingBoundaryTemplate {
  id: string;
  name: string;
  description: string;
  structured: string; // JSON string of the grading boundary structure
  category: 'IB' | 'AP' | 'A-Level' | 'GCSE' | 'Custom';
}

export const gradingBoundaryTemplates: GradingBoundaryTemplate[] = [
  // IB Templates
  {
    id: 'ib-7-point',
    name: 'IB 7-Point Scale',
    description: 'Standard IB 7-point grading scale',
    category: 'IB',
    structured: JSON.stringify({
      name: 'IB 7-Point Scale',
      description: 'International Baccalaureate 7-point grading scale',
      boundaries: [
        {
          id: 'ib7',
          grade: '7',
          description: 'Excellent',
          minPercentage: 85,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'ib6',
          grade: '6',
          description: 'Very Good',
          minPercentage: 75,
          maxPercentage: 84,
          color: '#8BC34A'
        },
        {
          id: 'ib5',
          grade: '5',
          description: 'Good',
          minPercentage: 65,
          maxPercentage: 74,
          color: '#CDDC39'
        },
        {
          id: 'ib4',
          grade: '4',
          description: 'Satisfactory',
          minPercentage: 55,
          maxPercentage: 64,
          color: '#FFEB3B'
        },
        {
          id: 'ib3',
          grade: '3',
          description: 'Mediocre',
          minPercentage: 45,
          maxPercentage: 54,
          color: '#FF9800'
        },
        {
          id: 'ib2',
          grade: '2',
          description: 'Poor',
          minPercentage: 35,
          maxPercentage: 44,
          color: '#FF5722'
        },
        {
          id: 'ib1',
          grade: '1',
          description: 'Very Poor',
          minPercentage: 0,
          maxPercentage: 34,
          color: '#F44336'
        }
      ]
    })
  },

  // AP Templates
  {
    id: 'ap-5-point',
    name: 'AP 5-Point Scale',
    description: 'Standard AP 5-point grading scale',
    category: 'AP',
    structured: JSON.stringify({
      name: 'AP 5-Point Scale',
      description: 'Advanced Placement 5-point grading scale',
      boundaries: [
        {
          id: 'ap5',
          grade: '5',
          description: 'Extremely Well Qualified',
          minPercentage: 80,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'ap4',
          grade: '4',
          description: 'Well Qualified',
          minPercentage: 65,
          maxPercentage: 79,
          color: '#8BC34A'
        },
        {
          id: 'ap3',
          grade: '3',
          description: 'Qualified',
          minPercentage: 50,
          maxPercentage: 64,
          color: '#FFEB3B'
        },
        {
          id: 'ap2',
          grade: '2',
          description: 'Possibly Qualified',
          minPercentage: 35,
          maxPercentage: 49,
          color: '#FF9800'
        },
        {
          id: 'ap1',
          grade: '1',
          description: 'No Recommendation',
          minPercentage: 0,
          maxPercentage: 34,
          color: '#F44336'
        }
      ]
    })
  },

  // A-Level Templates
  {
    id: 'alevel-grades',
    name: 'A-Level Grades',
    description: 'Standard A-Level grade boundaries (A*-E)',
    category: 'A-Level',
    structured: JSON.stringify({
      name: 'A-Level Grades',
      description: 'A-Level standard grade boundaries',
      boundaries: [
        {
          id: 'a-star',
          grade: 'A*',
          description: 'Exceptional',
          minPercentage: 90,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'a',
          grade: 'A',
          description: 'Excellent',
          minPercentage: 80,
          maxPercentage: 89,
          color: '#8BC34A'
        },
        {
          id: 'b',
          grade: 'B',
          description: 'Good',
          minPercentage: 70,
          maxPercentage: 79,
          color: '#CDDC39'
        },
        {
          id: 'c',
          grade: 'C',
          description: 'Satisfactory',
          minPercentage: 60,
          maxPercentage: 69,
          color: '#FFEB3B'
        },
        {
          id: 'd',
          grade: 'D',
          description: 'Limited',
          minPercentage: 50,
          maxPercentage: 59,
          color: '#FF9800'
        },
        {
          id: 'e',
          grade: 'E',
          description: 'Poor',
          minPercentage: 40,
          maxPercentage: 49,
          color: '#FF5722'
        },
        {
          id: 'u',
          grade: 'U',
          description: 'Ungraded',
          minPercentage: 0,
          maxPercentage: 39,
          color: '#F44336'
        }
      ]
    })
  },

  // GCSE Templates
  {
    id: 'gcse-9-1',
    name: 'GCSE 9-1 Scale',
    description: 'Standard GCSE 9-1 grading scale',
    category: 'GCSE',
    structured: JSON.stringify({
      name: 'GCSE 9-1 Scale',
      description: 'GCSE 9-1 grading scale',
      boundaries: [
        {
          id: 'grade9',
          grade: '9',
          description: 'Exceptional',
          minPercentage: 90,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'grade8',
          grade: '8',
          description: 'Excellent',
          minPercentage: 80,
          maxPercentage: 89,
          color: '#8BC34A'
        },
        {
          id: 'grade7',
          grade: '7',
          description: 'Very Good',
          minPercentage: 70,
          maxPercentage: 79,
          color: '#CDDC39'
        },
        {
          id: 'grade6',
          grade: '6',
          description: 'Good',
          minPercentage: 60,
          maxPercentage: 69,
          color: '#FFEB3B'
        },
        {
          id: 'grade5',
          grade: '5',
          description: 'Strong Pass',
          minPercentage: 50,
          maxPercentage: 59,
          color: '#FFC107'
        },
        {
          id: 'grade4',
          grade: '4',
          description: 'Standard Pass',
          minPercentage: 40,
          maxPercentage: 49,
          color: '#FF9800'
        },
        {
          id: 'grade3',
          grade: '3',
          description: 'Weak Pass',
          minPercentage: 30,
          maxPercentage: 39,
          color: '#FF5722'
        },
        {
          id: 'grade2',
          grade: '2',
          description: 'Fail',
          minPercentage: 20,
          maxPercentage: 29,
          color: '#E91E63'
        },
        {
          id: 'grade1',
          grade: '1',
          description: 'Fail',
          minPercentage: 0,
          maxPercentage: 19,
          color: '#F44336'
        }
      ]
    })
  },

  // Custom Templates
  {
    id: 'custom-letter-grades',
    name: 'Letter Grades (A-F)',
    description: 'Standard letter grade system with plus/minus',
    category: 'Custom',
    structured: JSON.stringify({
      name: 'Letter Grades (A-F)',
      description: 'Standard letter grade system',
      boundaries: [
        {
          id: 'a-plus',
          grade: 'A+',
          description: 'Outstanding',
          minPercentage: 97,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'a',
          grade: 'A',
          description: 'Excellent',
          minPercentage: 93,
          maxPercentage: 96,
          color: '#4CAF50'
        },
        {
          id: 'a-minus',
          grade: 'A-',
          description: 'Very Good',
          minPercentage: 90,
          maxPercentage: 92,
          color: '#8BC34A'
        },
        {
          id: 'b-plus',
          grade: 'B+',
          description: 'Good Plus',
          minPercentage: 87,
          maxPercentage: 89,
          color: '#8BC34A'
        },
        {
          id: 'b',
          grade: 'B',
          description: 'Good',
          minPercentage: 83,
          maxPercentage: 86,
          color: '#CDDC39'
        },
        {
          id: 'b-minus',
          grade: 'B-',
          description: 'Above Average',
          minPercentage: 80,
          maxPercentage: 82,
          color: '#CDDC39'
        },
        {
          id: 'c-plus',
          grade: 'C+',
          description: 'Average Plus',
          minPercentage: 77,
          maxPercentage: 79,
          color: '#FFEB3B'
        },
        {
          id: 'c',
          grade: 'C',
          description: 'Average',
          minPercentage: 73,
          maxPercentage: 76,
          color: '#FFEB3B'
        },
        {
          id: 'c-minus',
          grade: 'C-',
          description: 'Below Average',
          minPercentage: 70,
          maxPercentage: 72,
          color: '#FFC107'
        },
        {
          id: 'd-plus',
          grade: 'D+',
          description: 'Poor Plus',
          minPercentage: 67,
          maxPercentage: 69,
          color: '#FF9800'
        },
        {
          id: 'd',
          grade: 'D',
          description: 'Poor',
          minPercentage: 63,
          maxPercentage: 66,
          color: '#FF9800'
        },
        {
          id: 'd-minus',
          grade: 'D-',
          description: 'Very Poor',
          minPercentage: 60,
          maxPercentage: 62,
          color: '#FF5722'
        },
        {
          id: 'f',
          grade: 'F',
          description: 'Failing',
          minPercentage: 0,
          maxPercentage: 59,
          color: '#F44336'
        }
      ]
    })
  },
  {
    id: 'custom-percentage',
    name: 'Percentage Ranges',
    description: 'Simple percentage-based grading boundaries',
    category: 'Custom',
    structured: JSON.stringify({
      name: 'Percentage Ranges',
      description: 'Percentage-based grading boundaries',
      boundaries: [
        {
          id: 'excellent',
          grade: 'Excellent',
          description: '90-100%',
          minPercentage: 90,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'good',
          grade: 'Good',
          description: '80-89%',
          minPercentage: 80,
          maxPercentage: 89,
          color: '#8BC34A'
        },
        {
          id: 'satisfactory',
          grade: 'Satisfactory',
          description: '70-79%',
          minPercentage: 70,
          maxPercentage: 79,
          color: '#CDDC39'
        },
        {
          id: 'adequate',
          grade: 'Adequate',
          description: '60-69%',
          minPercentage: 60,
          maxPercentage: 69,
          color: '#FFEB3B'
        },
        {
          id: 'needs-improvement',
          grade: 'Needs Improvement',
          description: '50-59%',
          minPercentage: 50,
          maxPercentage: 59,
          color: '#FF9800'
        },
        {
          id: 'unsatisfactory',
          grade: 'Unsatisfactory',
          description: 'Below 50%',
          minPercentage: 0,
          maxPercentage: 49,
          color: '#F44336'
        }
      ]
    })
  },
  {
    id: 'custom-4-point',
    name: '4-Point Scale',
    description: 'Simple 4-point grading scale',
    category: 'Custom',
    structured: JSON.stringify({
      name: '4-Point Scale',
      description: 'Simple 4-point grading scale',
      boundaries: [
        {
          id: 'exceeds',
          grade: '4',
          description: 'Exceeds Expectations',
          minPercentage: 85,
          maxPercentage: 100,
          color: '#4CAF50'
        },
        {
          id: 'meets',
          grade: '3',
          description: 'Meets Expectations',
          minPercentage: 70,
          maxPercentage: 84,
          color: '#8BC34A'
        },
        {
          id: 'approaching',
          grade: '2',
          description: 'Approaching Expectations',
          minPercentage: 55,
          maxPercentage: 69,
          color: '#FFEB3B'
        },
        {
          id: 'below',
          grade: '1',
          description: 'Below Expectations',
          minPercentage: 0,
          maxPercentage: 54,
          color: '#F44336'
        }
      ]
    })
  }
];

export const getGradingBoundaryTemplatesByCategory = (category: GradingBoundaryTemplate['category']) => {
  return gradingBoundaryTemplates.filter(template => template.category === category);
};

export const getAllGradingBoundaryTemplates = () => {
  return gradingBoundaryTemplates;
};

export const getGradingBoundaryTemplateById = (id: string) => {
  return gradingBoundaryTemplates.find(template => template.id === id);
}; 