import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogFooter, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/contants";
import { constructDownloadUrl, getFileType } from "@/lib/utils";
import { ActionType } from "@/types";
import { Models } from "node-appwrite";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { deleteFile, renameFile, updateFileUsers } from "@/lib/actions/file.actions"; // Corrected import
import { useToast } from '@/hooks/use-toast';
import { FileDetails, ShareInput } from './ActionModalContent';

const ActionsDropdown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    const [name, setName] = useState(file.name);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [emails, setEmails] = useState<string[]>([]); // Corrected type

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        setName(file.name);
        setEmails([]); // Reset emails
    };

    const handleActions = async () => {
        if (!action) return;
        setIsLoading(true);
        try {
            if (action.value === "rename") {
                await renameFile(
                    { fileId: file.$id, name, extension: getFileType(file.name).extension },
                    (updatedFile) => {
                        setName(updatedFile.name);
                        toast({
                            description: `File renamed to ${updatedFile.name}`,
                            className: "success-toast",
                        });
                        closeAllModals();
                    }
                );
            } else if (action.value === "share") {
                await updateFileUsers(
                    { fileId: file.$id, emails },
                    () => {
                        toast({
                            description: `File shared with ${emails.join(', ')}`,
                            className: "success-toast",
                        });
                        closeAllModals();
                    }
                );
            } else if (action.value === "delete") {
                await deleteFile(
                    { fileId: file.$id, bucketFileId: file.bucketFileId },
                    () => {
                        toast({
                            description: `File deleted`,
                            className: "success-toast",
                        });
                        closeAllModals();
                    }
                );
            }
        }    
        catch (error) {
            toast({
                description: "Failed to execute action",
                className: "error-toast",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveUser = async (email: string) => {
        const updatedEmails = emails.filter((e) => e !== email);

        const success = await updateFileUsers({fileId: file.$id, emails: updatedEmails},() => {
            toast({
                description: `File canceled`,
                className: "success-toast",
            });
            if(success) setEmails(updatedEmails);
            closeAllModals();
        });

        
    }

    const renderDialogContent = () => {
        if (!action) return null;

        const { value, label } = action;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
                    {/* rename */}
                    {value === "rename" && (
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}

                    {/* details */}
                    {value === 'details' && <FileDetails file={file} />}

                    {/* share */}
                    {value === 'share' && (
                        <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser} />
                    )}

                    {/* delete */}
                    {value === 'delete' && (
                        <p className='delete-confirmation'>Are you sure you want to delete {' '}
                        <span className='delete-file-name'>{file.name}</span>?</p>
                    )}
                </DialogHeader>
                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button onClick={closeAllModals} className="modal-cancel-button">Cancel</Button>
                        <Button onClick={handleActions} className="modal-submit-button" disabled={isLoading}>
                            <p className="capitalize">{value}</p>
                            {isLoading && (
                                <img
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={24}
                                    height={24}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        );
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className="shad-no-focus">
                    <img src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="max-w-[200px] truncate">
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem
                            key={actionItem.value}
                            className="shad-dropdown-item"
                            onClick={() => {
                                setAction(actionItem);
                                if (["rename", "share", "delete", "details"].includes(actionItem.value)) {
                                    setIsModalOpen(true);
                                }
                            }}
                        >
                            {actionItem.value === 'download' ? (
                                <Link
                                    to={constructDownloadUrl(file.bucketFileId)}
                                    download={file.name}
                                    className="flex items-center gap-2"
                                >
                                    <img src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                                    {actionItem.label}
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <img src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                                    {actionItem.label}
                                </div>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {renderDialogContent()}
        </Dialog>
    );
};

export default ActionsDropdown;
