"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Rubric, { RubricCriteria } from "@/components/ui/Rubric";
import { markschemeTemplates, MarkschemeTemplate } from "@/lib/markschemeTemplates";
import Card from "@/components/ui/Card";
import { MdChecklist, MdSchool, MdStar } from "react-icons/md";

interface CreateMarkschemeProps {
	classId: string;
	existingMarkscheme?: {
		id: string;
		structured: string;
	};
	onSuccess?: () => void;
}

export default function CreateMarkscheme({ classId, existingMarkscheme, onSuccess }: CreateMarkschemeProps) {
	const [name, setName] = useState("");
	const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([]);
	const [showTemplates, setShowTemplates] = useState(false);
	const dispatch = useDispatch();

	const createMarkscheme = trpc.class.createMarkScheme.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: existingMarkscheme ? 'Markscheme updated successfully' : 'Markscheme created successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while saving markscheme'
			}));
		}
	});

	const updateMarkscheme = trpc.class.updateMarkScheme.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: 'Markscheme updated successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while updating markscheme'
			}));
		}
	});

	// Load existing markscheme data if editing
	useEffect(() => {
		if (existingMarkscheme) {
			try {
				const parsed = JSON.parse(existingMarkscheme.structured);
				setName(parsed.name || "");
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
				console.error("Error parsing existing markscheme:", error);
			}
		}
	}, [existingMarkscheme]);

	const handleSave = async () => {
		if (!name.trim()) {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: 'Please enter a markscheme name'
			}));
			return;
		}

		const structure = JSON.stringify({
			name: name.trim(),
			criteria: rubricCriteria
		});

		if (existingMarkscheme) {
			await updateMarkscheme.mutateAsync({
				classId,
				markSchemeId: existingMarkscheme.id,
				structure
			});
		} else {
			await createMarkscheme.mutateAsync({
				classId,
				structure
			});
		}
	};

	const isPending = createMarkscheme.isPending || updateMarkscheme.isPending;

	const loadTemplate = (template: MarkschemeTemplate) => {
		try {
			const parsed = JSON.parse(template.structured);
			setName(parsed.name || "");
			setRubricCriteria(parsed.criteria || []);
			setShowTemplates(false);
		} catch (error) {
			console.error("Error loading template:", error);
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: 'Error loading template'
			}));
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'IB':
				return <MdChecklist className="w-4 h-4 text-blue-500" />;
			case 'AP':
				return <MdSchool className="w-4 h-4 text-green-500" />;
			case 'A-Level':
				return <MdStar className="w-4 h-4 text-purple-500" />;
			case 'GCSE':
				return <MdStar className="w-4 h-4 text-orange-500" />;
			default:
				return <MdChecklist className="w-4 h-4 text-gray-500" />;
		}
	};

	return (
		<div className="space-y-6 w-[35rem]">
			{/* Template Selection */}
			{!existingMarkscheme && (
				<div>
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-semibold text-foreground-secondary">Templates</span>
					</div>
					
					<div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
						{markschemeTemplates.map((template) => (
							<Card
								key={template.id}
								className="p-3 cursor-pointer hover:bg-background-muted dark:hover:bg-background-subtle transition-colors"
								onClick={() => loadTemplate(template)}
							>
								<div className="flex items-center space-x-3">
									{getCategoryIcon(template.category)}
									<div className="flex-1">
										<div className="font-medium text-foreground text-sm">{template.name}</div>
										<div className="text-xs text-foreground-muted mt-1">{template.description}</div>
										<div className="text-xs text-foreground-subtle mt-1">
											{template.category}
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			)}

			<div>
				<Input.Text
					label="Markscheme Name"
					placeholder="e.g., Essay Grading Criteria"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div>
				<Rubric
					criteria={rubricCriteria}
					onChange={setRubricCriteria}
				/>
			</div>

			<div className="flex gap-3 justify-end">
				<Button.Light onClick={() => dispatch(closeModal())}>
					Cancel
				</Button.Light>
				<Button.Primary
					onClick={handleSave}
					disabled={isPending}
				>
					{isPending ? 'Saving...' : (existingMarkscheme ? 'Update Markscheme' : 'Create Markscheme')}
				</Button.Primary>
			</div>
		</div>
	);
} 