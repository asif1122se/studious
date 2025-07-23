"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GradingBoundaries, { GradeBoundary } from "@/components/ui/GradingBoundaries";
import { gradingBoundaryTemplates, GradingBoundaryTemplate } from "@/lib/gradingBoundaryTemplates";
import Card from "@/components/ui/Card";
import { MdChecklist, MdSchool, MdStar } from "react-icons/md";

interface CreateGradingBoundaryProps {
	classId: string;
	existingGradingBoundary?: {
		id: string;
		structured: string;
	};
	onSuccess?: () => void;
}

export default function CreateGradingBoundary({ classId, existingGradingBoundary, onSuccess }: CreateGradingBoundaryProps) {
	const [name, setName] = useState("");
	const [gradeBoundaries, setGradeBoundaries] = useState<GradeBoundary[]>([]);
	const dispatch = useDispatch();

	const createGradingBoundary = trpc.class.createGradingBoundary.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: existingGradingBoundary ? 'Grading boundary updated successfully' : 'Grading boundary created successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while saving grading boundary'
			}));
		}
	});

	const updateGradingBoundary = trpc.class.updateGradingBoundary.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: 'Grading boundary updated successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while updating grading boundary'
			}));
		}
	});

	// Load existing grading boundary data if editing
	useEffect(() => {
		if (existingGradingBoundary) {
			try {
				const parsed = JSON.parse(existingGradingBoundary.structured);
				setName(parsed.name || "");
				setGradeBoundaries(parsed.boundaries || []);
			} catch (error) {
				console.error("Error parsing existing grading boundary:", error);
			}
		}
	}, [existingGradingBoundary]);

	const handleSave = async () => {
		if (!name.trim()) {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: 'Please enter a grading boundary name'
			}));
			return;
		}

		const structure = JSON.stringify({
			name: name.trim(),
			boundaries: gradeBoundaries
		});

		if (existingGradingBoundary) {
			await updateGradingBoundary.mutateAsync({
				classId,
				gradingBoundaryId: existingGradingBoundary.id,
				structure
			});
		} else {
			await createGradingBoundary.mutateAsync({
				classId,
				structure
			});
		}
	};

	const isPending = createGradingBoundary.isPending || updateGradingBoundary.isPending;

	const loadTemplate = (template: GradingBoundaryTemplate) => {
		try {
			const parsed = JSON.parse(template.structured);
			setName(parsed.name || "");
			setGradeBoundaries(parsed.boundaries || []);
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
		<div className="space-y-6 w-[35rem] max-w-full">
			{/* Template Selection */}
			{!existingGradingBoundary && (
				<div>
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-semibold text-foreground-secondary">Templates</span>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
						{gradingBoundaryTemplates.map((template) => (
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
					label="Grading Boundary Name"
					placeholder="e.g., Standard A-F Grading"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div>
				<GradingBoundaries
					boundaries={gradeBoundaries}
					onChange={setGradeBoundaries}
				/>
			</div>

			<div className="flex gap-3 justify-end">
				<Button.Light onClick={() => dispatch(closeModal())}>
					Cancel
				</Button.Light>
				<Button.Primary
					onClick={handleSave}
					isLoading={isPending}
				>
					{isPending ? 'Saving...' : (existingGradingBoundary ? 'Update Grading Boundary' : 'Create Grading Boundary')}
				</Button.Primary>
			</div>
		</div>
	);
} 