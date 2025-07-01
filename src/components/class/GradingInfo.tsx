"use client";

import { useState, useEffect } from "react";
import GradingBoundaries, { GradeBoundary } from "@/components/ui/GradingBoundaries";
import { HiEye } from "react-icons/hi";
import Rubric, { RubricCriteria } from "@/components/ui/Rubric";
import Button from "../ui/Button";
import { openModal } from "@/store/appSlice";
import { useDispatch } from "react-redux";

interface GradingInfoProps {
	markScheme?: {
		id: string;
		structured: string;
	} | null;
	gradingBoundary?: {
		id: string;
		structured: string;
	} | null;
	readonly?: boolean;
}

export default function GradingInfo({ markScheme, gradingBoundary, readonly = true }: GradingInfoProps) {
	const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([]);
	const [gradeBoundaries, setGradeBoundaries] = useState<GradeBoundary[]>([]);
    const dispatch = useDispatch();

	// Extract names from structured data
	const getMarkschemeName = () => {
		if (!markScheme) return "Untitled Rubric";
		try {
			const parsed = JSON.parse(markScheme.structured);
			return parsed.name || "Untitled Rubric";
		} catch (error) {
			return "Untitled Rubric";
		}
	};

	const getGradingBoundaryName = () => {
		if (!gradingBoundary) return "Untitled Grading Boundary";
		try {
			const parsed = JSON.parse(gradingBoundary.structured);
			return parsed.name || "Untitled Grading Boundary";
		} catch (error) {
			return "Untitled Grading Boundary";
		}
	};
	// Parse markscheme data
	useEffect(() => {
		if (markScheme) {
			try {
				const parsed = JSON.parse(markScheme.structured);
				// Check if it's the new rubric format or old markscheme format
				if (parsed.criteria) {
					// New rubric format
					setRubricCriteria(parsed.criteria || []);
				} else if (parsed.items) {
					// Old markscheme format - convert to rubric format
					const convertedCriteria: RubricCriteria[] = parsed.items.map((item: any, index: number) => ({
						id: item.id || `criteria-${index}`,
						title: item.title || `Criteria ${index + 1}`,
						description: item.description || "",
						levels: [
							{
								id: "excellent",
								name: "Excellent",
								description: item.criteria?.[0] || "Outstanding performance",
								points: item.maxPoints || 4,
								color: "#4CAF50"
							},
							{
								id: "good",
								name: "Good",
								description: item.criteria?.[1] || "Good performance",
								points: Math.floor((item.maxPoints || 4) * 0.75),
								color: "#8BC34A"
							},
							{
								id: "satisfactory",
								name: "Satisfactory",
								description: item.criteria?.[2] || "Adequate performance",
								points: Math.floor((item.maxPoints || 4) * 0.5),
								color: "#FFEB3B"
							},
							{
								id: "needs-improvement",
								name: "Needs Improvement",
								description: item.criteria?.[3] || "Below expectations",
								points: Math.floor((item.maxPoints || 4) * 0.25),
								color: "#FF9800"
							}
						]
					}));
					setRubricCriteria(convertedCriteria);
				}
			} catch (error) {
				console.error("Error parsing markscheme:", error);
			}
		}
	}, [markScheme]);

	// Parse grading boundary data
	useEffect(() => {
		if (gradingBoundary) {
			try {
				const parsed = JSON.parse(gradingBoundary.structured);
				setGradeBoundaries(parsed.boundaries || []);
			} catch (error) {
				console.error("Error parsing grading boundary:", error);
			}
		}
	}, [gradingBoundary]);

	if (!markScheme && !gradingBoundary) {
		return null;
	}

	return (
		<div className="space-y-4">
            {/* Rubric Section */}
            {markScheme && (
                <div className="space-y-2">
                    <span className="text-sm font-semibold text-foreground-secondary">Rubric</span>
                    <Button.Light 
                        onClick={() => {
                            dispatch(openModal({
                                header: `${getMarkschemeName()}`,
                                body: 
                                <Rubric
                                criteria={rubricCriteria}
                                onChange={setRubricCriteria}
                                readonly={readonly}/>
                            }));
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-background-muted dark:hover:bg-background-subtle transition-colors"
                    > 
                        <div className="flex items-center gap-2">
                            <HiEye className="w-4 h-4 text-foreground-secondary" />
                            <span className="font-medium text-foreground-primary">{getMarkschemeName()}</span>
                        </div>
                        <span className="text-xs text-foreground-subtle">
                            {rubricCriteria.length} criteria
                        </span>
                    </Button.Light>
                </div>
            )}

            {/* Grading Boundaries Section */}
            {gradingBoundary && (
                <div className="space-y-2">
                    <span className="text-sm font-semibold text-foreground-secondary">Grading Boundaries</span>
                    
                    <Button.Light 
                        onClick={() => {
                            dispatch(openModal({
                                header: `${getGradingBoundaryName()}`,
                                body: <GradingBoundaries boundaries={gradeBoundaries} onChange={setGradeBoundaries} readonly={readonly} />
                            }));
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-background-muted dark:hover:bg-background-subtle transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <HiEye className="w-4 h-4 text-foreground-secondary" />
                            <span className="font-medium text-foreground-primary">{getGradingBoundaryName()}</span>
                        </div>
                        <span className="text-xs text-foreground-subtle">
                            {gradeBoundaries.length} grades
                        </span>
                    </Button.Light>
                </div>
            )}
		</div>
	);
} 