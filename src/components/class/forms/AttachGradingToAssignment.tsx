"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAlert, closeModal } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { trpc } from "@/utils/trpc";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { MdChecklist, MdSchool, MdSearch } from "react-icons/md";

interface AttachGradingToAssignmentProps {
	classId: string;
	assignmentId: string;
	currentMarkSchemeId?: string | null;
	currentGradingBoundaryId?: string | null;
	onSuccess?: () => void;
}

export default function AttachGradingToAssignment({ 
	classId, 
	assignmentId, 
	currentMarkSchemeId, 
	currentGradingBoundaryId, 
	onSuccess,
}: AttachGradingToAssignmentProps) {
	const [selectedMarkSchemeId, setSelectedMarkSchemeId] = useState<string | null>(currentMarkSchemeId || null);
	const [selectedGradingBoundaryId, setSelectedGradingBoundaryId] = useState<string | null>(currentGradingBoundaryId || null);
	const [markschemeSearch, setMarkschemeSearch] = useState("");
	const [gradingBoundarySearch, setGradingBoundarySearch] = useState("");
	const dispatch = useDispatch();

	const { data: markschemes } = trpc.class.listMarkSchemes.useQuery({ classId });
	const { data: gradingBoundaries } = trpc.class.listGradingBoundaries.useQuery({ classId });

	const attachMarkScheme = trpc.assignment.attachMarkScheme.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: 'Markscheme attached successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while attaching markscheme'
			}));
		}
	});

	const attachGradingBoundary = trpc.assignment.attachGradingBoundary.useMutation({
		onSuccess: () => {
			dispatch(addAlert({
				level: AlertLevel.SUCCESS,
				remark: 'Grading boundary attached successfully'
			}));
			onSuccess?.();
			dispatch(closeModal());
		},
		onError: (error) => {
			dispatch(addAlert({
				level: AlertLevel.ERROR,
				remark: error.message || 'Error occurred while attaching grading boundary'
			}));
		}
	});

	const handleSave = async () => {
		// Attach markscheme if selected
		if (selectedMarkSchemeId && selectedMarkSchemeId !== currentMarkSchemeId) {
			await attachMarkScheme.mutateAsync({
                classId,
				assignmentId,
				markSchemeId: selectedMarkSchemeId
			});
		}

		// Attach grading boundary if selected
		if (selectedGradingBoundaryId && selectedGradingBoundaryId !== currentGradingBoundaryId) {
			await attachGradingBoundary.mutateAsync({
                classId,
				assignmentId,
				gradingBoundaryId: selectedGradingBoundaryId
			});
		}

		// If both are being removed, we need to handle that case
		if (!selectedMarkSchemeId && currentMarkSchemeId) {
			await attachMarkScheme.mutateAsync({
                classId,
				assignmentId,
				markSchemeId: null
			});
		}

		if (!selectedGradingBoundaryId && currentGradingBoundaryId) {
			await attachGradingBoundary.mutateAsync({
                classId,
				assignmentId,
				gradingBoundaryId: null
			});
		}
	};

	const isPending = attachMarkScheme.isPending || attachGradingBoundary.isPending;

	// Filter markschemes based on search
	const filteredMarkschemes = markschemes?.filter(markscheme => {
		if (!markschemeSearch) return true;
		let name = "Untitled Markscheme";
		try {
			const parsed = JSON.parse(markscheme.structured);
			name = parsed.name || "Untitled Markscheme";
		} catch (error) {
			console.error("Error parsing markscheme:", error);
		}
		return name.toLowerCase().includes(markschemeSearch.toLowerCase());
	});

	// Filter grading boundaries based on search
	const filteredGradingBoundaries = gradingBoundaries?.filter(gradingBoundary => {
		if (!gradingBoundarySearch) return true;
		let name = "Untitled Grading Boundary";
		try {
			const parsed = JSON.parse(gradingBoundary.structured);
			name = parsed.name || "Untitled Grading Boundary";
		} catch (error) {
			console.error("Error parsing grading boundary:", error);
		}
		return name.toLowerCase().includes(gradingBoundarySearch.toLowerCase());
	});

	return (
		<div className="space-y-6 w-[30rem]">
			{/* Markscheme Selection */}
			<div>
				<label className="text-sm font-semibold text-foreground-secondary mb-3 block">
					Markscheme
				</label>
				
				{/* Search input for markschemes */}
				<div className="mb-3">
					<div className="relative">
						<Input.Text
							placeholder="Search markschemes..."
							value={markschemeSearch}
							onChange={(e) => setMarkschemeSearch(e.target.value)}
							className="w-full pl-10"
						/>
						<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
					</div>
				</div>

				<div className="space-y-2 max-h-48 overflow-y-auto">
					{/* No markscheme option */}
					<Card 
						className={`p-3 cursor-pointer transition-colors ${
							selectedMarkSchemeId === null 
								? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-600' 
								: 'hover:bg-background-muted dark:hover:bg-background-subtle'
						}`}
						onClick={() => setSelectedMarkSchemeId(null)}
					>
						<div className="flex items-center space-x-3">
							<Checkbox 
								checked={selectedMarkSchemeId === null}
								onChange={() => setSelectedMarkSchemeId(null)}
							/>
							<div className="flex items-center space-x-2">
								<MdChecklist className="w-4 h-4 text-foreground-muted" />
								<span className="font-medium">No Markscheme</span>
							</div>
						</div>
					</Card>

					{/* Available markschemes */}
					{filteredMarkschemes?.map((markscheme) => {
						let name = "Untitled Markscheme";
						try {
							const parsed = JSON.parse(markscheme.structured);
							name = parsed.name || "Untitled Markscheme";
						} catch (error) {
							console.error("Error parsing markscheme:", error);
						}

						return (
							<Card 
								key={markscheme.id}
								className={`p-3 cursor-pointer transition-colors ${
									selectedMarkSchemeId === markscheme.id 
										? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-600' 
										: 'hover:bg-background-muted dark:hover:bg-background-subtle'
								}`}
								onClick={() => setSelectedMarkSchemeId(markscheme.id)}
							>
								<div className="flex items-center space-x-3">
									<Checkbox 
										checked={selectedMarkSchemeId === markscheme.id}
										onChange={() => setSelectedMarkSchemeId(markscheme.id)}
									/>
									<div className="flex items-center space-x-2">
										<MdChecklist className="w-4 h-4 text-primary-500" />
										<span className="font-medium">{name}</span>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			</div>

			{/* Grading Boundary Selection */}
			<div>
				<label className="text-sm font-semibold text-foreground-secondary mb-3 block">
					Grading Boundary
				</label>
				
				{/* Search input for grading boundaries */}
				<div className="mb-3">
					<div className="relative">
						<Input.Text
							placeholder="Search grading boundaries..."
							value={gradingBoundarySearch}
							onChange={(e) => setGradingBoundarySearch(e.target.value)}
							className="w-full pl-10"
						/>
						<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
					</div>
				</div>

				<div className="space-y-2 max-h-48 overflow-y-auto">
					{/* No grading boundary option */}
					<Card 
						className={`p-3 cursor-pointer transition-colors ${
							selectedGradingBoundaryId === null 
								? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-600' 
								: 'hover:bg-background-muted dark:hover:bg-background-subtle'
						}`}
						onClick={() => setSelectedGradingBoundaryId(null)}
					>
						<div className="flex items-center space-x-3">
							<Checkbox 
								checked={selectedGradingBoundaryId === null}
								onChange={() => setSelectedGradingBoundaryId(null)}
							/>
							<div className="flex items-center space-x-2">
								<MdSchool className="w-4 h-4 text-foreground-muted" />
								<span className="font-medium">No Grading Boundary</span>
							</div>
						</div>
					</Card>

					{/* Available grading boundaries */}
					{filteredGradingBoundaries?.map((gradingBoundary) => {
						let name = "Untitled Grading Boundary";
						try {
							const parsed = JSON.parse(gradingBoundary.structured);
							name = parsed.name || "Untitled Grading Boundary";
						} catch (error) {
							console.error("Error parsing grading boundary:", error);
						}

						return (
							<Card 
								key={gradingBoundary.id}
								className={`p-3 cursor-pointer transition-colors ${
									selectedGradingBoundaryId === gradingBoundary.id 
										? 'bg-primary-50 border-primary-200 dark:bg-primary-900 dark:border-primary-600' 
										: 'hover:bg-background-muted dark:hover:bg-background-subtle'
								}`}
								onClick={() => setSelectedGradingBoundaryId(gradingBoundary.id)}
							>
								<div className="flex items-center space-x-3">
									<Checkbox 
										checked={selectedGradingBoundaryId === gradingBoundary.id}
										onChange={() => setSelectedGradingBoundaryId(gradingBoundary.id)}
									/>
									<div className="flex items-center space-x-2">
										<MdSchool className="w-4 h-4 text-primary-500" />
										<span className="font-medium">{name}</span>
									</div>
								</div>
							</Card>
						);
					})}
				</div>
			</div>

			<div className="flex gap-3 justify-end">
				<Button.Light onClick={() => dispatch(closeModal())}>
					Cancel
				</Button.Light>
				<Button.Primary
					onClick={handleSave}
					isLoading={isPending}
				>
					{isPending ? 'Saving...' : 'Attach'}
				</Button.Primary>
			</div>
		</div>
	);
} 