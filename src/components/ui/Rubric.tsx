"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

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

export interface RubricProps {
	criteria: RubricCriteria[];
	onChange: (criteria: RubricCriteria[]) => void;
	readonly?: boolean;
}

export default function Rubric({ criteria, onChange, readonly = false }: RubricProps) {
	const [editingCriteria, setEditingCriteria] = useState<string | null>(null);
	const [newLevelName, setNewLevelName] = useState("");
	const [newLevelDescription, setNewLevelDescription] = useState("");
	const [newLevelPoints, setNewLevelPoints] = useState(0);

	const addCriteria = () => {
		const newCriteria: RubricCriteria = {
			id: Date.now().toString(),
			title: "",
			description: "",
			levels: [
				{
					id: "excellent",
					name: "Excellent",
					description: "Outstanding performance",
					points: 4,
					color: "#4CAF50"
				},
				{
					id: "good",
					name: "Good",
					description: "Good performance",
					points: 3,
					color: "#8BC34A"
				},
				{
					id: "satisfactory",
					name: "Satisfactory",
					description: "Adequate performance",
					points: 2,
					color: "#FFEB3B"
				},
				{
					id: "needs-improvement",
					name: "Needs Improvement",
					description: "Below expectations",
					points: 1,
					color: "#FF9800"
				}
			]
		};
		onChange([...criteria, newCriteria]);
		setEditingCriteria(newCriteria.id);
	};

	const updateCriteria = (id: string, updates: Partial<RubricCriteria>) => {
		onChange(criteria.map(item => 
			item.id === id ? { ...item, ...updates } : item
		));
	};

	const deleteCriteria = (id: string) => {
		onChange(criteria.filter(item => item.id !== id));
		setEditingCriteria(null);
	};

	const updateLevel = (criteriaId: string, levelId: string, updates: Partial<RubricLevel>) => {
		onChange(criteria.map(criterion => {
			if (criterion.id === criteriaId) {
				return {
					...criterion,
					levels: criterion.levels.map(level => 
						level.id === levelId ? { ...level, ...updates } : level
					)
				};
			}
			return criterion;
		}));
	};

	const addLevel = (criteriaId: string) => {
		if (!newLevelName.trim()) return;
		
		const newLevel: RubricLevel = {
			id: Date.now().toString(),
			name: newLevelName.trim(),
			description: newLevelDescription.trim(),
			points: newLevelPoints,
			color: "#9E9E9E"
		};

		updateCriteria(criteriaId, {
			levels: [...criteria.find(c => c.id === criteriaId)!.levels, newLevel]
		});
		
		setNewLevelName("");
		setNewLevelDescription("");
		setNewLevelPoints(0);
	};

	const deleteLevel = (criteriaId: string, levelId: string) => {
		const criterion = criteria.find(c => c.id === criteriaId);
		if (!criterion || criterion.levels.length <= 1) return;
		
		updateCriteria(criteriaId, {
			levels: criterion.levels.filter(level => level.id !== levelId)
		});
	};

	const totalPoints = criteria.reduce((sum, criterion) => {
		const maxPoints = Math.max(...criterion.levels.map(level => level.points));
		return sum + maxPoints;
	}, 0);

	if (readonly) {
		return (
			<Card className="p-6">
				<div className="mb-6">
					<h3 className="text-lg font-semibold text-foreground-primary">Rubric</h3>
					<p className="text-sm text-foreground-secondary">Total Points: {totalPoints}</p>
				</div>

				{criteria.length === 0 ? (
					<div className="text-center py-8 text-foreground-secondary">
						<p>No rubric criteria defined.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full border-collapse">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left p-3 font-medium text-foreground-primary">Criteria</th>
									{criteria[0]?.levels.map((level) => (
										<th key={level.id} className="text-center p-3 font-medium text-foreground-primary min-w-[200px]">
											<div className="flex flex-col items-center">
												<span className="font-semibold">{level.name}</span>
												<span className="text-sm text-foreground-secondary">({level.points} pts)</span>
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{criteria.map((criterion, index) => (
									<tr key={criterion.id} className="border-b border-border">
										<td className="p-3 align-top">
											<div className="font-medium text-foreground-primary">
												{index + 1}. {criterion.title}
											</div>
											{criterion.description && (
												<div className="text-sm text-foreground-secondary mt-1">
													{criterion.description}
												</div>
											)}
										</td>
										{criterion.levels.map((level) => (
											<td key={level.id} className="p-3 align-top">
												<div className="text-sm text-foreground-secondary">
													{level.description}
												</div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-foreground-primary">Rubric</h3>
					<p className="text-sm text-foreground-secondary">Total Points: {totalPoints}</p>
				</div>
				<Button.Light onClick={addCriteria} className="flex items-center gap-2">
					<MdAdd className="w-4 h-4" />
					Add Criteria
				</Button.Light>
			</div>

			{criteria.length === 0 ? (
				<div className="text-center py-8 text-foreground-secondary">
					<p>No rubric criteria defined yet.</p>
					<p className="text-sm mt-2">Click "Add Criteria" to start creating your rubric.</p>
				</div>
			) : (
				<div className="space-y-6">
					{criteria.map((criterion, index) => (
						<div key={criterion.id} className="border border-border rounded-lg p-4">
							{editingCriteria === criterion.id ? (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input.Text
											label="Criteria Title"
											placeholder="e.g., Content Quality"
											value={criterion.title}
											onChange={(e) => updateCriteria(criterion.id, { title: e.target.value })}
										/>
									</div>
									
									<Input.Textarea
										label="Description"
										placeholder="Describe what this criteria evaluates..."
										value={criterion.description}
										onChange={(e) => updateCriteria(criterion.id, { description: e.target.value })}
									/>

									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<label className="text-sm font-medium text-foreground-primary">Achievement Levels</label>
											<Button.SM onClick={() => addLevel(criterion.id)}>
												<MdAdd className="w-4 h-4" />
											</Button.SM>
										</div>
										
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{criterion.levels.map((level) => (
												<div key={level.id} className="border border-border rounded p-3">
													<div className="flex items-center justify-between mb-2">
														<span className="font-medium text-sm">{level.name}</span>
														{criterion.levels.length > 1 && (
															<Button.SM
																size="sm"
																onClick={() => deleteLevel(criterion.id, level.id)}
															>
																<MdDelete className="w-4 h-4" />
															</Button.SM>
														)}
													</div>
													<Input.Text
														label="Name"
														value={level.name}
														onChange={(e) => updateLevel(criterion.id, level.id, { name: e.target.value })}
														className="mb-2"
													/>
													<Input.Text
														label="Points"
														type="number"
														value={level.points}
														onChange={(e) => updateLevel(criterion.id, level.id, { points: parseInt(e.target.value) || 0 })}
														className="mb-2"
													/>
													<Input.Textarea
														label="Description"
														value={level.description}
														onChange={(e) => updateLevel(criterion.id, level.id, { description: e.target.value })}
													/>
												</div>
											))}
										</div>
									</div>

									<div className="flex gap-2">
										<Button.Primary onClick={() => setEditingCriteria(null)}>
											Done
										</Button.Primary>
										<Button.Light onClick={() => deleteCriteria(criterion.id)}>
											Delete Criteria
										</Button.Light>
									</div>
								</div>
							) : (
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<span className="text-sm font-medium text-foreground-secondary">
												{index + 1}.
											</span>
											<h4 className="font-medium text-foreground-primary">
												{criterion.title || "Untitled Criteria"}
											</h4>
											<span className="text-sm text-foreground-secondary">
												({Math.max(...criterion.levels.map(l => l.points))} points)
											</span>
										</div>
										<Button.SM
											size="sm"
											onClick={() => setEditingCriteria(criterion.id)}
										>
											<MdEdit className="w-4 h-4" />
										</Button.SM>
									</div>
									
									{criterion.description && (
										<p className="text-sm text-foreground-secondary ml-6">
											{criterion.description}
										</p>
									)}
									
									<div className="ml-6">
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
											{criterion.levels.map((level) => (
												<div key={level.id} className="border border-border rounded p-2">
													<div className="font-medium text-sm text-foreground-primary">
														{level.name} ({level.points} pts)
													</div>
													<div className="text-xs text-foreground-secondary mt-1">
														{level.description}
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</Card>
	);
} 