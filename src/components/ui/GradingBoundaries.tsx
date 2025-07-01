"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import ColorPicker from "./ColorPicker";
import { MdAdd, MdDelete, MdEdit, MdSchool } from "react-icons/md";

export interface GradeBoundary {
	id: string;
	grade: string;
	minPercentage: number;
	maxPercentage: number;
	description: string;
	color: string;
}

export interface GradingBoundariesProps {
	boundaries: GradeBoundary[];
	onChange: (boundaries: GradeBoundary[]) => void;
	readonly?: boolean;
}

const DEFAULT_COLORS = [
	"#10B981", // Green for A
	"#3B82F6", // Blue for B
	"#F59E0B", // Yellow for C
	"#F97316", // Orange for D
	"#EF4444", // Red for F
];

const DEFAULT_GRADES = ["A", "B", "C", "D", "F"];

export default function GradingBoundaries({ boundaries, onChange, readonly = false }: GradingBoundariesProps) {
	const [editingBoundary, setEditingBoundary] = useState<string | null>(null);

	const addBoundary = () => {
		const newBoundary: GradeBoundary = {
			id: Date.now().toString(),
			grade: "",
			minPercentage: 0,
			maxPercentage: 100,
			description: "",
			color: DEFAULT_COLORS[boundaries.length % DEFAULT_COLORS.length]
		};
		onChange([...boundaries, newBoundary]);
		setEditingBoundary(newBoundary.id);
	};

	const updateBoundary = (id: string, updates: Partial<GradeBoundary>) => {
		onChange(boundaries.map(boundary => 
			boundary.id === id ? { ...boundary, ...updates } : boundary
		));
	};

	const deleteBoundary = (id: string) => {
		onChange(boundaries.filter(boundary => boundary.id !== id));
		setEditingBoundary(null);
	};

	const resetToDefaults = () => {
		const defaultBoundaries: GradeBoundary[] = [
			{ id: "1", grade: "A", minPercentage: 90, maxPercentage: 100, description: "Excellent", color: DEFAULT_COLORS[0] },
			{ id: "2", grade: "B", minPercentage: 80, maxPercentage: 89, description: "Good", color: DEFAULT_COLORS[1] },
			{ id: "3", grade: "C", minPercentage: 70, maxPercentage: 79, description: "Satisfactory", color: DEFAULT_COLORS[2] },
			{ id: "4", grade: "D", minPercentage: 60, maxPercentage: 69, description: "Needs Improvement", color: DEFAULT_COLORS[3] },
			{ id: "5", grade: "F", minPercentage: 0, maxPercentage: 59, description: "Failing", color: DEFAULT_COLORS[4] },
		];
		onChange(defaultBoundaries);
	};

	const getGradeForPercentage = (percentage: number): string => {
		const boundary = boundaries.find(b => 
			percentage >= b.minPercentage && percentage <= b.maxPercentage
		);
		return boundary?.grade || "N/A";
	};

	const sortedBoundaries = [...boundaries].sort((a, b) => b.minPercentage - a.minPercentage);

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<MdSchool className="w-5 h-5 text-primary-500" />
					<h3 className="text-lg font-semibold text-foreground-primary">Grading Boundaries</h3>
				</div>
				{!readonly && (
					<div className="flex gap-2">
						<Button.Light onClick={resetToDefaults}>
							Reset to Defaults
						</Button.Light>
						<Button.Light onClick={addBoundary} className="flex items-center gap-2">
							<MdAdd className="w-4 h-4" />
							Add Grade
						</Button.Light>
					</div>
				)}
			</div>

			{boundaries.length === 0 ? (
				<div className="text-center py-8 text-foreground-secondary">
					<p>No grading boundaries defined yet.</p>
					{!readonly && (
						<div className="mt-4 space-y-2">
							<p className="text-sm">Click "Reset to Defaults" for standard A-F grading,</p>
							<p className="text-sm">or "Add Grade" to create custom boundaries.</p>
						</div>
					)}
				</div>
			) : (
				<div className="space-y-4">
                                {/* Grading Blocks Display */}
            {boundaries.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {boundaries.map((boundary, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium"
                                style={{
                                    backgroundColor: boundary.color || '#e5e7eb',
                                    color: boundary.color ? '#ffffff' : '#374151'
                                }}
                            >
                                <span className="font-bold">{boundary.grade}</span>
                                <span className="text-xs opacity-90">
                                    {boundary.minPercentage}%+
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
					{/* Boundary Details */}
					<div className="space-y-3">
						{sortedBoundaries.map((boundary) => (
							<div key={boundary.id} className="border border-border rounded-lg p-4">
								{editingBoundary === boundary.id && !readonly ? (
									<div className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Input.Text
												label="Grade"
												placeholder="A"
												value={boundary.grade}
												onChange={(e) => updateBoundary(boundary.id, { grade: e.target.value })}
											/>
											<ColorPicker
												label="Grade Color"
												value={boundary.color}
												onChange={(color) => updateBoundary(boundary.id, { color })}
												description="Choose a color to represent this grade"
												size="md"
											/>
										</div>
										
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Input.Text
												label="Min Percentage"
												type="number"
												placeholder="90"
												value={boundary.minPercentage}
												onChange={(e) => updateBoundary(boundary.id, { minPercentage: parseInt(e.target.value) || 0 })}
											/>
											<Input.Text
												label="Max Percentage"
												type="number"
												placeholder="100"
												value={boundary.maxPercentage}
												onChange={(e) => updateBoundary(boundary.id, { maxPercentage: parseInt(e.target.value) || 100 })}
											/>
										</div>
										
										<Input.Text
											label="Description"
											placeholder="e.g., Excellent performance"
											value={boundary.description}
											onChange={(e) => updateBoundary(boundary.id, { description: e.target.value })}
										/>

										<div className="flex gap-2">
											<Button.Primary onClick={() => setEditingBoundary(null)}>
												Done
											</Button.Primary>
											<Button.Light onClick={() => deleteBoundary(boundary.id)}>
												Delete Grade
											</Button.Light>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div
												className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
												style={{ backgroundColor: boundary.color }}
											>
												{boundary.grade}
											</div>
											<div>
												<div className="font-medium text-foreground-primary">
													{boundary.grade} ({boundary.minPercentage}% - {boundary.maxPercentage}%)
												</div>
												{boundary.description && (
													<div className="text-sm text-foreground-secondary">
														{boundary.description}
													</div>
												)}
											</div>
										</div>
										{!readonly && (
											<Button.Light
												size="sm"
												onClick={() => setEditingBoundary(boundary.id)}
											>
												<MdEdit className="w-4 h-4" />
											</Button.Light>
										)}
									</div>
								)}
							</div>
						))}
					</div>

					{/* Grade Calculator */}
					<div className="mt-6 p-4 bg-background-muted rounded-lg">
						<h4 className="font-medium text-foreground-primary mb-3">Grade Calculator</h4>
						<div className="flex gap-4 items-center">
							<Input.Text
								label="Enter Percentage"
								type="number"
								placeholder="85"
								min="0"
								max="100"
								className="w-32"
								onChange={(e) => {
									const percentage = parseInt(e.target.value) || 0;
									const grade = getGradeForPercentage(percentage);
									// You could add state to display the result
								}}
							/>
							<div className="text-sm text-foreground-secondary">
								Enter a percentage to see the corresponding grade
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
} 