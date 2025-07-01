"use client";

import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Card from "./Card";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";

export interface MarkschemeItem {
	id: string;
	title: string;
	description: string;
	maxPoints: number;
	criteria: string[];
}

export interface MarkschemeProps {
	items: MarkschemeItem[];
	onChange: (items: MarkschemeItem[]) => void;
	readonly?: boolean;
}

export default function Markscheme({ items, onChange, readonly = false }: MarkschemeProps) {
	const [editingItem, setEditingItem] = useState<string | null>(null);
	const [newCriteria, setNewCriteria] = useState("");

	const addItem = () => {
		const newItem: MarkschemeItem = {
			id: Date.now().toString(),
			title: "",
			description: "",
			maxPoints: 0,
			criteria: []
		};
		onChange([...items, newItem]);
		setEditingItem(newItem.id);
	};

	const updateItem = (id: string, updates: Partial<MarkschemeItem>) => {
		onChange(items.map(item => 
			item.id === id ? { ...item, ...updates } : item
		));
	};

	const deleteItem = (id: string) => {
		onChange(items.filter(item => item.id !== id));
		setEditingItem(null);
	};

	const addCriteria = (itemId: string) => {
		if (!newCriteria.trim()) return;
		
		updateItem(itemId, {
			criteria: [...items.find(item => item.id === itemId)!.criteria, newCriteria.trim()]
		});
		setNewCriteria("");
	};

	const removeCriteria = (itemId: string, criteriaIndex: number) => {
		const item = items.find(item => item.id === itemId);
		if (!item) return;
		
		updateItem(itemId, {
			criteria: item.criteria.filter((_, index) => index !== criteriaIndex)
		});
	};

	const totalPoints = items.reduce((sum, item) => sum + item.maxPoints, 0);

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold text-foreground-primary">Markscheme</h3>
				{!readonly && (
					<Button.Light onClick={addItem} className="flex items-center gap-2">
						<MdAdd className="w-4 h-4" />
						Add Item
					</Button.Light>
				)}
			</div>

			{items.length === 0 ? (
				<div className="text-center py-8 text-foreground-secondary">
					<p>No markscheme items defined yet.</p>
					{!readonly && (
						<p className="text-sm mt-2">Click "Add Item" to start creating your markscheme.</p>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{items.map((item, index) => (
						<div key={item.id} className="border border-border rounded-lg p-4">
							{editingItem === item.id && !readonly ? (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input.Text
											label="Title"
											placeholder="e.g., Content Quality"
											value={item.title}
											onChange={(e) => updateItem(item.id, { title: e.target.value })}
										/>
										<Input.Text
											label="Max Points"
											type="number"
											placeholder="10"
											value={item.maxPoints}
											onChange={(e) => updateItem(item.id, { maxPoints: parseInt(e.target.value) || 0 })}
										/>
									</div>
									
									<Input.Textarea
										label="Description"
										placeholder="Describe what this item evaluates..."
										value={item.description}
										onChange={(e) => updateItem(item.id, { description: e.target.value })}
									/>

									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground-primary">Criteria</label>
										<div className="flex gap-2">
											<Input.Text
												placeholder="Add a criterion..."
												value={newCriteria}
												onChange={(e) => setNewCriteria(e.target.value)}
												onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addCriteria(item.id)}
												className="flex-1"
											/>
											<Button.Light 
												onClick={() => addCriteria(item.id)}
												disabled={!newCriteria.trim()}
											>
												Add
											</Button.Light> 
										</div>
										
										{item.criteria.length > 0 && (
											<div className="space-y-2">
												{item.criteria.map((criterion, criteriaIndex) => (
													<div key={criteriaIndex} className="flex items-center gap-2 p-2 bg-background-muted rounded">
														<span className="flex-1 text-sm">{criterion}</span>
														<Button.SM
															size="sm"
															onClick={() => removeCriteria(item.id, criteriaIndex)}
														>
															<MdDelete className="w-4 h-4" />
														</Button.SM>
													</div>
												))}
											</div>
										)}
									</div>

									<div className="flex gap-2">
										<Button.Primary onClick={() => setEditingItem(null)}>
											Done
										</Button.Primary>
										<Button.Light onClick={() => deleteItem(item.id)}>
											Delete Item
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
												{item.title || "Untitled Item"}
											</h4>
											<span className="text-sm text-foreground-secondary">
												({item.maxPoints} points)
											</span>
										</div>
										{!readonly && (
											<Button.SM
												size="sm"
												onClick={() => setEditingItem(item.id)}
											>
												<MdEdit className="w-4 h-4" />
											</Button.SM>
										)}
									</div>
									
									{item.description && (
										<p className="text-sm text-foreground-secondary ml-6">
											{item.description}
										</p>
									)}
									
									{item.criteria.length > 0 && (
										<div className="ml-6 space-y-1">
											{item.criteria.map((criterion, criteriaIndex) => (
												<div key={criteriaIndex} className="flex items-start gap-2">
													<span className="text-xs text-foreground-secondary mt-1">•</span>
													<span className="text-sm text-foreground-secondary">{criterion}</span>
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					))}
					
					<div className="flex justify-end pt-4 border-t border-border">
						<span className="text-sm font-medium text-foreground-primary">
							Total Points: {totalPoints}
						</span>
					</div>
				</div>
			)}
		</Card>
	);
} 