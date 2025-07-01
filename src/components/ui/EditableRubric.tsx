"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import { MdSave, MdRefresh } from "react-icons/md";

export interface RubricCriteria {
	id: string;
	title: string;
	description: string;
	levels: RubricLevel[];
}

export interface RubricLevel {
	id: string;
	name: string;
	description: string;
	points: number;
	color?: string;
}

export interface RubricGrade {
	criteriaId: string;
	selectedLevelId: string;
	points: number;
	comments: string;
}

export interface EditableRubricProps {
	criteria: RubricCriteria[];
	grades: RubricGrade[];
	onGradesChange: (grades: RubricGrade[]) => void;
	readonly?: boolean;
}

export default function EditableRubric({ criteria, grades, onGradesChange, readonly = false }: EditableRubricProps) {
	const [localGrades, setLocalGrades] = useState<RubricGrade[]>(grades);

	// Initialize grades for any new criteria
	useEffect(() => {
		const updatedGrades = [...localGrades];
		let hasChanges = false;

		criteria.forEach(criterion => {
			const existingGrade = updatedGrades.find(g => g.criteriaId === criterion.id);
			if (!existingGrade) {
				updatedGrades.push({
					criteriaId: criterion.id,
					selectedLevelId: criterion.levels[0]?.id || '',
					points: criterion.levels[0]?.points || 0,
					comments: ''
				});
				hasChanges = true;
			}
		});

		if (hasChanges) {
			setLocalGrades(updatedGrades);
			onGradesChange(updatedGrades);
		}
	}, [criteria, localGrades, onGradesChange]);

	const updateGrade = (criteriaId: string, updates: Partial<RubricGrade>) => {
		const updatedGrades = localGrades.map(grade => 
			grade.criteriaId === criteriaId ? { ...grade, ...updates } : grade
		);
		setLocalGrades(updatedGrades);
		onGradesChange(updatedGrades);
	};

	const updatePoints = (criteriaId: string, points: number) => {
		updateGrade(criteriaId, { points });
	};

	const updateComments = (criteriaId: string, comments: string) => {
		updateGrade(criteriaId, { comments });
	};

	const selectLevel = (criteriaId: string, levelId: string) => {
		const criterion = criteria.find(c => c.id === criteriaId);
		const level = criterion?.levels.find(l => l.id === levelId);
		
		if (level) {
			updateGrade(criteriaId, { 
				selectedLevelId: levelId, 
				points: level.points 
			});
		}
	};

	const resetGrades = () => {
		const resetGrades = criteria.map(criterion => ({
			criteriaId: criterion.id,
			selectedLevelId: criterion.levels[0]?.id || '',
			points: criterion.levels[0]?.points || 0,
			comments: ''
		}));
		setLocalGrades(resetGrades);
		onGradesChange(resetGrades);
	};

	const totalPoints = localGrades.reduce((sum, grade) => sum + grade.points, 0);
	const maxPossiblePoints = criteria.reduce((sum, criterion) => {
		const maxPoints = Math.max(...criterion.levels.map(level => level.points));
		return sum + maxPoints;
	}, 0);

	if (readonly) {
		return (
			<Card className="p-6">
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-foreground-primary">Rubric Assessment</h3>
					<p className="text-sm text-foreground-secondary">
						Score: {totalPoints} / {maxPossiblePoints} points
					</p>
				</div>

				{criteria.length === 0 ? (
					<div className="text-center py-8 text-foreground-secondary">
						<p>No rubric criteria defined.</p>
					</div>
				) : (
					<div className="space-y-6">
						{criteria.map((criterion) => {
							const grade = localGrades.find(g => g.criteriaId === criterion.id);
							const selectedLevel = criterion.levels.find(l => l.id === grade?.selectedLevelId);

							return (
								<div key={criterion.id} className="border border-border rounded-lg p-4">
									<div className="mb-4">
										<h4 className="font-medium text-foreground-primary mb-1">
											{criterion.title}
										</h4>
										{criterion.description && (
											<p className="text-sm text-foreground-secondary">
												{criterion.description}
											</p>
										)}
									</div>

									<div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<span className="text-sm font-medium text-foreground-secondary">Selected Level:</span>
											{selectedLevel && (
												<span 
													className="px-2 py-1 rounded text-sm font-medium"
													style={{
														backgroundColor: selectedLevel.color || '#e5e7eb',
														color: selectedLevel.color ? '#ffffff' : '#374151'
													}}
												>
													{selectedLevel.name} ({selectedLevel.points} pts)
												</span>
											)}
										</div>
										
										<div className="text-sm text-foreground-secondary">
											{selectedLevel?.description}
										</div>
									</div>

									{grade?.comments && (
										<div className="mb-3">
											<span className="text-sm font-medium text-foreground-secondary">Comments:</span>
											<p className="text-sm text-foreground-primary mt-1">{grade.comments}</p>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-foreground-primary">Rubric Assessment</h3>
					<p className="text-sm text-foreground-secondary">
						Score: {totalPoints} / {maxPossiblePoints} points
					</p>
				</div>
				<Button.Light onClick={resetGrades} className="flex items-center gap-2">
					<MdRefresh className="w-4 h-4" />
					Reset
				</Button.Light>
			</div>

			{criteria.length === 0 ? (
				<div className="text-center py-8 text-foreground-secondary">
					<p>No rubric criteria defined.</p>
				</div>
			) : (
				<div className="space-y-6">
					{criteria.map((criterion) => {
						const grade = localGrades.find(g => g.criteriaId === criterion.id);

						return (
							<div key={criterion.id} className="border border-border rounded-lg p-4">
								<div className="mb-4">
									<h4 className="font-medium text-foreground-primary mb-1">
										{criterion.title}
									</h4>
									{criterion.description && (
										<p className="text-sm text-foreground-secondary">
											{criterion.description}
										</p>
									)}
								</div>

								<div className="mb-4">
									<label className="text-sm font-medium text-foreground-secondary mb-2 block">
										Select Achievement Level:
									</label>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
										{criterion.levels.map((level) => (
											<button
												key={level.id}
												onClick={() => selectLevel(criterion.id, level.id)}
												className={`p-3 rounded-lg border text-left transition-all ${
													grade?.selectedLevelId === level.id
														? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
														: 'border-border hover:border-primary-300'
												}`}
											>
												<div className="flex items-center justify-between mb-1">
													<span 
														className="font-medium text-sm"
														style={{ color: level.color || '#374151' }}
													>
														{level.name}
													</span>
													<span className="text-xs font-medium text-foreground-secondary">
														{level.points} pts
													</span>
												</div>
												<div className="text-xs text-foreground-secondary">
													{level.description}
												</div>
											</button>
										))}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Input.Text
											label="Points"
											type="number"
											value={grade?.points || 0}
											onChange={(e) => updatePoints(criterion.id, parseInt(e.target.value) || 0)}
											min={0}
											max={Math.max(...criterion.levels.map(l => l.points))}
										/>
									</div>
									<div>
										<Input.Textarea
											label="Comments"
											value={grade?.comments || ''}
											onChange={(e) => updateComments(criterion.id, e.target.value)}
											placeholder="Add feedback for this criterion..."
											rows={2}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</Card>
	);
} 