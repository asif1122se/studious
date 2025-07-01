interface GradingBoundary {
    minPercentage: number;
    maxPercentage: number;
    grade: string;
    description: string;
    color: string;
}

export function calculateGrade(percentage: number, gradingBoundary: GradingBoundary[]): {
    grade: string | undefined;
    color: string | undefined;
} | undefined {
    console.log(gradingBoundary);   
    // Handle edge cases
    if (!gradingBoundary || gradingBoundary.length === 0) {
        return undefined;
    }

    // Find the boundary that matches the percentage
    const grade = gradingBoundary.find(boundary => 
        percentage >= boundary.minPercentage && percentage <= boundary.maxPercentage
    );
    
    return {
        grade: grade?.grade,
        color: grade?.color
    };
}