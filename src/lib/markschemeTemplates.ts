export interface MarkschemeTemplate {
  id: string;
  name: string;
  description: string;
  structured: string; // JSON string of the markscheme structure
  category: 'IB' | 'AP' | 'A-Level' | 'GCSE' | 'Custom';
}

export const markschemeTemplates: MarkschemeTemplate[] = [
  // IB Templates
  {
    id: 'ib-complete',
    name: 'IB Complete Rubric (A-D)',
    description: 'Complete IB rubric with all four criteria (A, B, C, D)',
    category: 'IB',
    structured: JSON.stringify({
      name: 'IB Complete Rubric',
      description: 'Complete IB assessment rubric with all four criteria',
      criteria: [
        {
          id: 'a',
          title: 'Criterion A - Knowledge and Understanding',
          description: 'Demonstrate knowledge and understanding of subject-specific content and concepts through descriptions, explanations and examples.',
          levels: [
            {
              id: 'a1',
              name: 'Level 1-2 (Limited)',
              description: 'Demonstrates limited knowledge and understanding of subject-specific content and concepts. Limited knowledge of subject-specific content, basic understanding of concepts, few relevant examples provided.',
              points: 2,
              color: '#FF9800'
            },
            {
              id: 'a2',
              name: 'Level 3-4 (Adequate)',
              description: 'Demonstrates adequate knowledge and understanding of subject-specific content and concepts. Adequate knowledge of subject-specific content, good understanding of concepts, some relevant examples provided.',
              points: 4,
              color: '#FFEB3B'
            },
            {
              id: 'a3',
              name: 'Level 5-6 (Substantial)',
              description: 'Demonstrates substantial knowledge and understanding of subject-specific content and concepts. Substantial knowledge of subject-specific content, thorough understanding of concepts, many relevant examples provided.',
              points: 6,
              color: '#8BC34A'
            },
            {
              id: 'a4',
              name: 'Level 7-8 (Excellent)',
              description: 'Demonstrates excellent knowledge and understanding of subject-specific content and concepts. Excellent knowledge of subject-specific content, deep understanding of concepts, extensive relevant examples provided.',
              points: 8,
              color: '#4CAF50'
            }
          ]
        },
        {
          id: 'b',
          title: 'Criterion B - Application and Analysis',
          description: 'Apply knowledge and understanding to identify, construct and appraise arguments.',
          levels: [
            {
              id: 'b1',
              name: 'Level 1-2 (Limited)',
              description: 'Demonstrates limited application and analysis of knowledge and understanding. Limited application of knowledge, basic analysis of arguments, few connections made.',
              points: 2,
              color: '#FF9800'
            },
            {
              id: 'b2',
              name: 'Level 3-4 (Adequate)',
              description: 'Demonstrates adequate application and analysis of knowledge and understanding. Adequate application of knowledge, good analysis of arguments, some connections made.',
              points: 4,
              color: '#FFEB3B'
            },
            {
              id: 'b3',
              name: 'Level 5-6 (Substantial)',
              description: 'Demonstrates substantial application and analysis of knowledge and understanding. Substantial application of knowledge, thorough analysis of arguments, many connections made.',
              points: 6,
              color: '#8BC34A'
            },
            {
              id: 'b4',
              name: 'Level 7-8 (Excellent)',
              description: 'Demonstrates excellent application and analysis of knowledge and understanding. Excellent application of knowledge, deep analysis of arguments, extensive connections made.',
              points: 8,
              color: '#4CAF50'
            }
          ]
        },
        {
          id: 'c',
          title: 'Criterion C - Synthesis and Evaluation',
          description: 'Synthesize knowledge and understanding in order to make reasoned, substantiated judgments and solve problems.',
          levels: [
            {
              id: 'c1',
              name: 'Level 1-2 (Limited)',
              description: 'Demonstrates limited synthesis and evaluation. Limited synthesis of knowledge, basic evaluation, few reasoned judgments.',
              points: 2,
              color: '#FF9800'
            },
            {
              id: 'c2',
              name: 'Level 3-4 (Adequate)',
              description: 'Demonstrates adequate synthesis and evaluation. Adequate synthesis of knowledge, good evaluation, some reasoned judgments.',
              points: 4,
              color: '#FFEB3B'
            },
            {
              id: 'c3',
              name: 'Level 5-6 (Substantial)',
              description: 'Demonstrates substantial synthesis and evaluation. Substantial synthesis of knowledge, thorough evaluation, many reasoned judgments.',
              points: 6,
              color: '#8BC34A'
            },
            {
              id: 'c4',
              name: 'Level 7-8 (Excellent)',
              description: 'Demonstrates excellent synthesis and evaluation. Excellent synthesis of knowledge, deep evaluation, extensive reasoned judgments.',
              points: 8,
              color: '#4CAF50'
            }
          ]
        },
        {
          id: 'd',
          title: 'Criterion D - Use and Application of Appropriate Skills',
          description: 'Use and apply appropriate skills and techniques.',
          levels: [
            {
              id: 'd1',
              name: 'Level 1-2 (Limited)',
              description: 'Demonstrates limited use and application of appropriate skills and techniques. Limited use of skills, basic application of techniques, few appropriate methods used.',
              points: 2,
              color: '#FF9800'
            },
            {
              id: 'd2',
              name: 'Level 3-4 (Adequate)',
              description: 'Demonstrates adequate use and application of appropriate skills and techniques. Adequate use of skills, good application of techniques, some appropriate methods used.',
              points: 4,
              color: '#FFEB3B'
            },
            {
              id: 'd3',
              name: 'Level 5-6 (Substantial)',
              description: 'Demonstrates substantial use and application of appropriate skills and techniques. Substantial use of skills, thorough application of techniques, many appropriate methods used.',
              points: 6,
              color: '#8BC34A'
            },
            {
              id: 'd4',
              name: 'Level 7-8 (Excellent)',
              description: 'Demonstrates excellent use and application of appropriate skills and techniques. Excellent use of skills, deep application of techniques, extensive appropriate methods used.',
              points: 8,
              color: '#4CAF50'
            }
          ]
        }
      ]
    })
  },

  // AP Templates
  {
    id: 'ap-rubric',
    name: 'AP Standard Rubric',
    description: 'Standard AP scoring rubric with 0-6 scale',
    category: 'AP',
    structured: JSON.stringify({
      name: 'AP Standard Rubric',
      description: 'Advanced Placement standard scoring rubric',
      criteria: [
        {
          id: 'ap',
          title: 'AP Response Quality',
          description: 'Assessment of response quality across multiple dimensions',
          levels: [
            {
              id: 'ap6',
              name: 'Score 6 - Excellent',
              description: 'Demonstrates excellence in all areas of the response. Comprehensive understanding of the topic, clear and well-organized response, strong evidence and examples, excellent analysis and synthesis.',
              points: 6,
              color: '#4CAF50'
            },
            {
              id: 'ap5',
              name: 'Score 5 - Strong',
              description: 'Demonstrates strong understanding with minor weaknesses. Strong understanding of the topic, well-organized response, good evidence and examples, good analysis.',
              points: 5,
              color: '#8BC34A'
            },
            {
              id: 'ap4',
              name: 'Score 4 - Adequate',
              description: 'Demonstrates adequate understanding with some weaknesses. Adequate understanding of the topic, generally organized response, some evidence and examples, basic analysis.',
              points: 4,
              color: '#FFEB3B'
            },
            {
              id: 'ap3',
              name: 'Score 3 - Limited',
              description: 'Demonstrates limited understanding with significant weaknesses. Limited understanding of the topic, poorly organized response, minimal evidence and examples, weak analysis.',
              points: 3,
              color: '#FF9800'
            },
            {
              id: 'ap2',
              name: 'Score 2 - Weak',
              description: 'Demonstrates weak understanding with major weaknesses. Weak understanding of the topic, disorganized response, little evidence or examples, poor analysis.',
              points: 2,
              color: '#F57C00'
            },
            {
              id: 'ap1',
              name: 'Score 1 - Poor',
              description: 'Demonstrates poor understanding with fundamental weaknesses. Poor understanding of the topic, very disorganized response, no evidence or examples, no analysis.',
              points: 1,
              color: '#D32F2F'
            },
            {
              id: 'ap0',
              name: 'Score 0 - No Response',
              description: 'No response or completely off-topic. No response provided, completely off-topic, illegible response.',
              points: 0,
              color: '#9E9E9E'
            }
          ]
        }
      ]
    })
  },

  // A-Level Templates
  {
    id: 'alevel-grades',
    name: 'A-Level Grade Descriptors',
    description: 'Standard A-Level grade descriptors (A*-E)',
    category: 'A-Level',
    structured: JSON.stringify({
      name: 'A-Level Grade Descriptors',
      description: 'A-Level standard grade descriptors',
      criteria: [
        {
          id: 'alevel',
          title: 'A-Level Performance',
          description: 'Assessment of A-Level performance across multiple criteria',
          levels: [
            {
              id: 'a-star',
              name: 'A* - Exceptional',
              description: 'Exceptional performance demonstrating outstanding knowledge and skills. Outstanding knowledge and understanding, exceptional analytical skills, excellent synthesis and evaluation, outstanding communication.',
              points: 90,
              color: '#4CAF50'
            },
            {
              id: 'a',
              name: 'A - Excellent',
              description: 'Excellent performance demonstrating comprehensive knowledge and skills. Excellent knowledge and understanding, strong analytical skills, good synthesis and evaluation, excellent communication.',
              points: 80,
              color: '#8BC34A'
            },
            {
              id: 'b',
              name: 'B - Good',
              description: 'Good performance demonstrating solid knowledge and skills. Good knowledge and understanding, sound analytical skills, adequate synthesis and evaluation, good communication.',
              points: 70,
              color: '#CDDC39'
            },
            {
              id: 'c',
              name: 'C - Satisfactory',
              description: 'Satisfactory performance demonstrating adequate knowledge and skills. Adequate knowledge and understanding, basic analytical skills, limited synthesis and evaluation, satisfactory communication.',
              points: 60,
              color: '#FFEB3B'
            },
            {
              id: 'd',
              name: 'D - Limited',
              description: 'Limited performance demonstrating basic knowledge and skills. Basic knowledge and understanding, weak analytical skills, poor synthesis and evaluation, limited communication.',
              points: 50,
              color: '#FF9800'
            },
            {
              id: 'e',
              name: 'E - Poor',
              description: 'Poor performance demonstrating minimal knowledge and skills. Minimal knowledge and understanding, very weak analytical skills, no synthesis or evaluation, poor communication.',
              points: 40,
              color: '#F44336'
            }
          ]
        }
      ]
    })
  },

  // GCSE Templates
  {
    id: 'gcse-grades',
    name: 'GCSE Grade Descriptors',
    description: 'Standard GCSE grade descriptors (9-1)',
    category: 'GCSE',
    structured: JSON.stringify({
      name: 'GCSE Grade Descriptors',
      description: 'GCSE standard grade descriptors (9-1 scale)',
      criteria: [
        {
          id: 'gcse',
          title: 'GCSE Performance',
          description: 'Assessment of GCSE performance across multiple criteria',
          levels: [
            {
              id: 'grade9',
              name: 'Grade 9 - Exceptional',
              description: 'Exceptional performance at the highest level. Exceptional knowledge and understanding, outstanding analytical and evaluative skills, excellent communication and presentation, consistently high quality work.',
              points: 90,
              color: '#4CAF50'
            },
            {
              id: 'grade8',
              name: 'Grade 8 - Excellent',
              description: 'Excellent performance demonstrating high-level skills. Excellent knowledge and understanding, strong analytical and evaluative skills, very good communication and presentation, high quality work.',
              points: 80,
              color: '#8BC34A'
            },
            {
              id: 'grade7',
              name: 'Grade 7 - Very Good',
              description: 'Very good performance demonstrating strong skills. Very good knowledge and understanding, good analytical and evaluative skills, good communication and presentation, good quality work.',
              points: 70,
              color: '#CDDC39'
            },
            {
              id: 'grade6',
              name: 'Grade 6 - Good',
              description: 'Good performance demonstrating solid skills. Good knowledge and understanding, sound analytical and evaluative skills, adequate communication and presentation, satisfactory quality work.',
              points: 60,
              color: '#FFEB3B'
            },
            {
              id: 'grade5',
              name: 'Grade 5 - Satisfactory',
              description: 'Satisfactory performance demonstrating adequate skills. Adequate knowledge and understanding, basic analytical and evaluative skills, basic communication and presentation, adequate quality work.',
              points: 50,
              color: '#FF9800'
            },
            {
              id: 'grade4',
              name: 'Grade 4 - Limited',
              description: 'Limited performance demonstrating basic skills. Basic knowledge and understanding, limited analytical and evaluative skills, limited communication and presentation, basic quality work.',
              points: 40,
              color: '#F57C00'
            },
            {
              id: 'grade3',
              name: 'Grade 3 - Weak',
              description: 'Weak performance demonstrating minimal skills. Minimal knowledge and understanding, weak analytical and evaluative skills, poor communication and presentation, poor quality work.',
              points: 30,
              color: '#F44336'
            },
            {
              id: 'grade2',
              name: 'Grade 2 - Very Weak',
              description: 'Very weak performance demonstrating very limited skills. Very limited knowledge and understanding, very weak analytical and evaluative skills, very poor communication and presentation, very poor quality work.',
              points: 20,
              color: '#D32F2F'
            },
            {
              id: 'grade1',
              name: 'Grade 1 - Minimal',
              description: 'Minimal performance demonstrating almost no skills. Almost no knowledge and understanding, no analytical or evaluative skills, no communication or presentation skills, minimal quality work.',
              points: 10,
              color: '#9E9E9E'
            }
          ]
        }
      ]
    })
  },

  // Custom Templates
  {
    id: 'custom-basic',
    name: 'Basic Custom Rubric',
    description: 'A simple 4-level rubric template for custom use',
    category: 'Custom',
    structured: JSON.stringify({
      name: 'Basic Custom Rubric',
      description: 'A simple 4-level rubric template',
      criteria: [
        {
          id: 'custom',
          title: 'Custom Assessment',
          description: 'Assessment of work quality and performance',
          levels: [
            {
              id: 'excellent',
              name: 'Excellent (4)',
              description: 'Outstanding performance that exceeds expectations. Exceeds all requirements, demonstrates exceptional understanding, shows creativity and originality, excellent presentation and communication.',
              points: 4,
              color: '#4CAF50'
            },
            {
              id: 'good',
              name: 'Good (3)',
              description: 'Good performance that meets expectations. Meets all requirements, demonstrates good understanding, shows some creativity, good presentation and communication.',
              points: 3,
              color: '#8BC34A'
            },
            {
              id: 'satisfactory',
              name: 'Satisfactory (2)',
              description: 'Satisfactory performance that partially meets expectations. Meets most requirements, demonstrates basic understanding, shows limited creativity, adequate presentation and communication.',
              points: 2,
              color: '#FFEB3B'
            },
            {
              id: 'needs-improvement',
              name: 'Needs Improvement (1)',
              description: 'Performance that does not meet expectations. Meets few requirements, demonstrates limited understanding, shows no creativity, poor presentation and communication.',
              points: 1,
              color: '#FF9800'
            }
          ]
        }
      ]
    })
  },
  {
    id: 'custom-percentage',
    name: 'Percentage-Based Rubric',
    description: 'A percentage-based rubric template (90-100%, 80-89%, etc.)',
    category: 'Custom',
    structured: JSON.stringify({
      name: 'Percentage-Based Rubric',
      description: 'A percentage-based grading rubric',
      criteria: [
        {
          id: 'percentage',
          title: 'Percentage-Based Assessment',
          description: 'Assessment based on percentage performance levels',
          levels: [
            {
              id: 'a-plus',
              name: 'A+ (95-100%)',
              description: 'Exceptional work that demonstrates mastery. Exceptional quality and effort, demonstrates complete mastery, shows outstanding creativity, exemplary presentation.',
              points: 100,
              color: '#4CAF50'
            },
            {
              id: 'a',
              name: 'A (90-94%)',
              description: 'Excellent work that demonstrates strong understanding. Excellent quality and effort, demonstrates strong understanding, shows good creativity, very good presentation.',
              points: 92,
              color: '#8BC34A'
            },
            {
              id: 'b-plus',
              name: 'B+ (85-89%)',
              description: 'Very good work that demonstrates good understanding. Very good quality and effort, demonstrates good understanding, shows some creativity, good presentation.',
              points: 87,
              color: '#CDDC39'
            },
            {
              id: 'b',
              name: 'B (80-84%)',
              description: 'Good work that demonstrates adequate understanding. Good quality and effort, demonstrates adequate understanding, shows limited creativity, adequate presentation.',
              points: 82,
              color: '#FFEB3B'
            },
            {
              id: 'c-plus',
              name: 'C+ (75-79%)',
              description: 'Satisfactory work that demonstrates basic understanding. Satisfactory quality and effort, demonstrates basic understanding, shows minimal creativity, basic presentation.',
              points: 77,
              color: '#FF9800'
            },
            {
              id: 'c',
              name: 'C (70-74%)',
              description: 'Adequate work that demonstrates limited understanding. Adequate quality and effort, demonstrates limited understanding, shows no creativity, poor presentation.',
              points: 72,
              color: '#F57C00'
            },
            {
              id: 'd',
              name: 'D (60-69%)',
              description: 'Below average work that demonstrates poor understanding. Below average quality and effort, demonstrates poor understanding, no creativity shown, very poor presentation.',
              points: 65,
              color: '#F44336'
            },
            {
              id: 'f',
              name: 'F (Below 60%)',
              description: 'Failing work that demonstrates very poor understanding. Poor quality and effort, demonstrates very poor understanding, no creativity shown, unacceptable presentation.',
              points: 50,
              color: '#D32F2F'
            }
          ]
        }
      ]
    })
  }
];

export const getTemplatesByCategory = (category: MarkschemeTemplate['category']) => {
  return markschemeTemplates.filter(template => template.category === category);
};

export const getAllTemplates = () => {
  return markschemeTemplates;
};

export const getTemplateById = (id: string) => {
  return markschemeTemplates.find(template => template.id === id);
}; 