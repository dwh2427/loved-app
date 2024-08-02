import FormatedDate from "@/components/formated-date/FormatedDate";
import useApiCaller from "@/hooks/useApiCaller";
import useAuthState from "@/hooks/useAuthState";
import useClientError from "@/hooks/useClientError";
import comment from "@/public/comment.svg";
import LovedMsgLogo from "@/public/loved-msg-person.svg";
import loved_blank from '@/public/loved_blank.png';
import loved_full from '@/public/loved_full.png';
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Comment = ({ params }) => {
    const router = useRouter();
    const { user, loading } = useAuthState();
    const [comments, setComment] = useState([]);
    const handleClientError = useClientError();
    const [expandedComments, setExpandedComments] = useState(new Array(comments.length).fill(false));
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyText, setReplyText] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(true);
    const apiCaller = useApiCaller();

    // Fetch comments from the server
    const getComment = async () => {
        const res = await axios.get(`/${params.slug}/api/all_comment?pageName=${params.slug}`);
        if (res?.data?.data) {
            setComment(res?.data?.data);
            setIsCommentLoading(false);
        }
        setIsCommentLoading(false);
    };

    useEffect(() => {
        getComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.slug]);

    // Capitalize the first letter of the text
    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    // Toggle the expansion of comments
    const handleToggle = (index) => {
        const newExpandedComments = [...expandedComments];
        newExpandedComments[index] = !newExpandedComments[index];
        setExpandedComments(newExpandedComments);
    };

    // Toggle the reply box for a comment
    const toggleReplyBox = (id) => {
        setComment(comments.map(comment =>
            comment._id === id ? { ...comment, showReply: !comment?.showReply } : comment
        ));
    };

    // Handle reply text change
    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    // Handle like or unlike a comment
    const handleCommentLike = async (commentId, action) => {
        const updatedComments = comments.map(comment => {
            if (comment._id === commentId) {
                const isAlreadyLiked = comment.likes.find(item => item.userId._id === user._id);
                const updatedLikes = isAlreadyLiked
                    ? comment.likes.filter(item => item.userId._id !== user._id)
                    : [...comment.likes, { userId: { _id: user._id, first_name: user.first_name, last_name: user.last_name } }];

                return { ...comment, likes: updatedLikes };
            }
            return comment;
        });

        // Optimistically update the UI
        setComment(updatedComments);

        try {
            const res = await apiCaller.put(`/${params.slug}/api/update_like`, {
                commentId,
                action
            });

            if (res?.data?.data) {
                setComment(comments.map(comment => comment._id === commentId ? { ...comment, likes: res?.data?.data.likes } : comment));
            }
        } catch (error) {
            // Revert the optimistic update if the API call fails
            setComment(comments);
            handleClientError(error);
        }
    };

    // Handle reply submission
    const handleReplySubmit = async (id) => {
        // Optimistically update the UI
        const optimisticComments = comments.map(comment => {
            if (comment._id === id) {
                const newReply = {
                    replied_by: user,
                    replyText,
                    createdAt: new Date().toISOString(),
                };
                return {
                    ...comment,
                    replies: [...comment.replies, newReply],
                    showReply: !comment.showReply,
                };
            }
            return comment;
        });
        setComment(optimisticComments);
        setReplyText('');

        try {
            const res = await apiCaller.put(`/${params.slug}/api/reply_comment`, {
                commentId: id, replyText
            });
            if (res?.data) {
                setComment(comments.map(comment =>
                    comment._id === id ? { ...comment, replies: res?.data?.data.replies, showReply: !comment?.showReply } : comment
                ));
            }
        } catch (error) {
            // Revert the optimistic update if the API call fails
            setComment(comments);
            handleClientError(error);
        }
    };

    const toggleReply = (index) => {
        setExpandedReplies({
            ...expandedReplies,
            [index]: !expandedReplies[index],
        });
    };

    const getFirstWords = (text, wordCount) => {
        return text.split(" ").slice(0, wordCount).join(" ");
    };

    const countWords = (text) => {
        return text.split(" ").length;
    };

    return (
        <section className="mx-auto mt-[72px] flex w-full flex-col items-center gap-4 md:w-[500px]">
            {loading && isCommentLoading ? <Loader2 className="mr-2 size-6 animate-spin" /> : ""}
            {comments?.length > 0 &&
                comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((cm, index) => (
                    <div key={index} className="w-full">
                        <div className="flex items-start justify-start gap-2 rounded-md p-4">
                            <div className="avatar-section">
                                <Image
                                    src={LovedMsgLogo}
                                    alt="Picture"
                                    width={51}
                                    height={49}
                                />
                            </div>

                            <div className="flex w-full flex-col justify-center ">
                                <div className="h-[32px] ">
                                    <div className="flex justify-between">
                                        <p className="title-holder">
                                            {capitalize(cm?.username)}
                                        </p>
                                        {cm?.tipAmount !== 0 && <p className="text-sm title-holder">${cm?.tipAmount}</p>}
                                    </div>


                                    <div className="flex justify-between">
                                        <p className="font-sans text-[12px] text-[#586580] date-section">
                                            {cm?.comment_by && cm.comment_by?.additional_info.city}
                                        </p>
                                        <div>
                                            <p className="font-sans text-[12px] date-section">
                                                <FormatedDate dateString={cm?.createdAt} />
                                            </p>
                                        </div>
                                    </div>
                                </div>


                                {cm?.image && (
                                    <div className="mt-2 flex">
                                        <Image
                                            src={cm?.image}
                                            alt="Picture"
                                            width={125}
                                            height={125}
                                            className="rounded-lg"
                                        />
                                    </div>
                                )}

                                <div
                                    key={index}
                                    style={{ fontWeight: 500 }}
                                    className={`title-holder mt-2 `}
                                    onClick={() => handleToggle(index)}
                                >

                                    <div>
                                        <p>
                                            {!expandedComments[index] ? getFirstWords(cm?.comment, 27) : cm?.comment}
                                            {countWords(cm?.comment) > 27 && (
                                                <span className="text-[#A5B5D4]">
                                                    {expandedComments[index] ? "" : <span><span className="text-black">...</span> more</span>}
                                                </span>
                                            )}
                                        </p>

                                    </div>
                                    {/* <p className="font-sans text-sm text-end text-base font-medium leading-4 text-[#586580]"> <FormatedDate dateString={reply?.createdAt} /></p> */}
                                </div>


                                <div className="flex gap-2 pt-2">
                                    <Image
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (user?.email) {
                                                const isAlreadyExist = cm.likes?.find(item => item?.userId?._id === user?._id);
                                                handleCommentLike(cm?._id, isAlreadyExist ? 'remove' : 'add');
                                            } else router.push('/login');
                                        }}
                                        src={cm.likes.find(item => item?.userId?._id === user?._id) ? loved_full : loved_blank}
                                        width={16}
                                        height={16}
                                        alt="comment icon"
                                    />
                                    <Image
                                        className="cursor-pointer"
                                        onClick={() => user?.email ? toggleReplyBox(cm?._id) : router.push('/login')}
                                        src={comment}
                                        width={12}
                                        height={12}
                                        alt="comment icon"
                                    />
                                </div>


                                {cm?.likes?.length > 0 && (
                                    <p className="py-2 text-[12px] leading-4">
                                        Liked by {cm.likes.some(item => item?.userId?._id === user?._id) ? (
                                            <>
                                                <span className="font-[800]">you </span>
                                                <span >{cm.likes.length > 1 && cm.likes.length === 2 ? ' and ' : cm.likes.length !== 1 && ','}</span>
                                                {cm.likes.length > 1 && (
                                                    <>
                                                        <span className="font-[800]">{cm.likes[cm.likes.length - 2]?.userId?.first_name + " " + cm.likes[cm.likes.length - 2]?.userId?.last_name}</span>
                                                        {cm.likes.length > 2 && " and "}
                                                    </>
                                                )}
                                                {cm.likes.length > 2 && (
                                                    <>
                                                        <span className="font-[800]">others</span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-[800]">{cm.likes[cm.likes.length - 1]?.userId?.first_name + " " + cm.likes[cm.likes.length - 1]?.userId?.last_name}</span>
                                                {cm.likes.length > 1 && " and "}
                                                {cm.likes.length > 1 && <span className="font-[800]">others</span>}
                                            </>
                                        )}
                                    </p>
                                )}

                                {user?.email && cm?.showReply && (
                                    <form onSubmit={(e) => { e.preventDefault(); replyText.length > 0 && handleReplySubmit(cm?._id) }} className="mb-2 relative">
                                        <button type="submit" className="absolute right-3 top-1">
                                            <svg width="30" height="30" className="cursor-pointer" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="30" height="30" rx="16" fill="#FF318C" />
                                                <path d="M15 25C15 25.5523 15.4477 26 16 26C16.5523 26 17 25.5523 17 25L15 25ZM16.7071 6.29289C16.3166 5.90237 15.6834 5.90237 15.2929 6.29289L8.92893 12.6569C8.53841 13.0474 8.53841 13.6805 8.92893 14.0711C9.31946 14.4616 9.95262 14.4616 10.3431 14.0711L16 8.41421L21.6569 14.0711C22.0474 14.4616 22.6805 14.4616 23.0711 14.0711C23.4616 13.6805 23.4616 13.0474 23.0711 12.6569L16.7071 6.29289ZM17 25L17 7L15 7L15 25L17 25Z" fill="white" />
                                            </svg>
                                        </button>
                                        <input
                                            value={replyText}
                                            onChange={(e) => handleReplyChange(e)}
                                            type="text"
                                            placeholder="Add a comment"
                                            className="border  border-[#A5B5D4] focus:border-[#A5B5D4] py-2 px-3 text-[12px] w-full rounded-[32px] bg-white outline-none transition duration-150 ease-in-out focus:ring-1 focus:ring-[#A5B5D4] text-[#2E266F]"
                                            style={{ paddingRight: '2.5rem' }}
                                        />
                                    </form>
                                )}


                                {cm?.replies.length > 0 &&
                                    cm?.replies
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .map((reply, replyIndex) => (
                                            <div key={replyIndex} className="mb-2 text-[12px]">
                                                <div>
                                                    <p className="capitalize">
                                                        <span className="font-[800]">{reply?.replied_by?.first_name + " " + reply?.replied_by?.last_name}</span>
                                                        <span className="text-[#A5B5D4] font-[500]"> <FormatedDate dateString={reply?.createdAt} /></span>
                                                    </p>{" "}
                                                    <p className="">
                                                        {expandedReplies[`${index}-${replyIndex}`]
                                                            ? reply?.replyText
                                                            : getFirstWords(reply?.replyText, 27)}

                                                        {countWords(reply?.replyText) > 27 && (
                                                            <span className="text-[#A5B5D4]" onClick={() => toggleReply(`${index}-${replyIndex}`)}>
                                                                {expandedReplies[`${index}-${replyIndex}`] ? "" : <span><span className="text-black">...</span> more</span>}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                {/* <p className="font-sans text-sm text-end text-base font-medium leading-4 text-[#586580]"> <FormatedDate dateString={reply?.createdAt} /></p> */}
                                            </div>
                                        ))}
                            </div>
                        </div>
                    </div>
                ))}
        </section>
    );
};

export default Comment;

// Explanation of the code with comments:
// - The `Comment` component is used to display and manage comments and replies for a specific page identified by `params.slug`.
// - It fetches comments from the server and allows users to like/unlike comments and add replies.
// - The state variables `comments`, `expandedComments`, `isCommentLoading`, and `replyText` manage the comments, their expansion state, loading state, and the text for new replies, respectively.
// - The `handleToggle` function toggles the expansion state of a comment to show/hide its full text.
// - The `getComment` function fetches comments from the server and updates the state.
// - The `handleCommentLike` function handles liking or
