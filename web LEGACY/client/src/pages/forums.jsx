var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { MessageSquare, Plus, Clock, Pin, Lock } from "lucide-react";
import { z } from "zod";
var createPostSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    categoryId: z.string().min(1, "Category is required"),
    authorId: z.string().optional(),
});
export default function Forums() {
    var _this = this;
    var _a = useAuth(), user = _a.user, loading = _a.loading;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _b = useState(""), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = useState(false), isCreateDialogOpen = _c[0], setIsCreateDialogOpen = _c[1];
    var _d = useQuery({
        queryKey: ['/api/forum/categories'],
    }), categories = _d.data, categoriesLoading = _d.isLoading;
    var _e = useQuery({
        queryKey: ['/api/forum/posts', selectedCategory],
        enabled: !!selectedCategory,
    }), posts = _e.data, postsLoading = _e.isLoading;
    var form = useForm({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: "",
            content: "",
            categoryId: "",
            authorId: (user === null || user === void 0 ? void 0 : user.id) || "",
        },
    });
    var createPostMutation = useMutation({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiRequest("POST", "/api/forum/posts", data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
            setIsCreateDialogOpen(false);
            form.reset();
            toast({
                title: "Success",
                description: "Your post has been created successfully!",
            });
        },
        onError: function (error) {
            toast({
                title: "Error",
                description: "Failed to create post. Please try again.",
                variant: "destructive",
            });
        },
    });
    var onSubmit = function (data) {
        if (!user)
            return;
        createPostMutation.mutate(__assign(__assign({}, data), { authorId: user.id }));
    };
    var formatTimestamp = function (timestamp) {
        var date = new Date(timestamp);
        var now = new Date();
        var diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return 'Just now';
        if (diffInHours < 24)
            return "".concat(diffInHours, " hours ago");
        return "".concat(Math.floor(diffInHours / 24), " days ago");
    };
    if (loading) {
        return (<div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8"/>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map(function (_, i) { return (<Skeleton key={i} className="h-32 w-full"/>); })}
        </div>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2" data-testid="forums-title">
              Community Forums
            </h1>
            <p className="text-muted-foreground">
              Connect with other players, share strategies, and get help
            </p>
          </div>
          {user && (<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90" data-testid="create-post-button">
                  <Plus className="w-4 h-4 mr-2"/>
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="categoryId" render={function (_a) {
                var _b;
                var field = _a.field;
                return (<FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={(_b = field.value) !== null && _b !== void 0 ? _b : undefined}>
                            <FormControl>
                              <SelectTrigger data-testid="post-category-select">
                                <SelectValue placeholder="Select a category"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories === null || categories === void 0 ? void 0 : categories.map(function (category) { return (<SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>); })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>);
            }}/>
                    <FormField control={form.control} name="title" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter post title..." {...field} value={field.value || ""} data-testid="post-title-input"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
            }}/>
                    <FormField control={form.control} name="content" render={function (_a) {
                var field = _a.field;
                return (<FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Write your post content..." className="min-h-[120px]" {...field} value={field.value || ""} data-testid="post-content-textarea"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>);
            }}/>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={function () { return setIsCreateDialogOpen(false); }} data-testid="cancel-post-button">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createPostMutation.isPending} data-testid="submit-post-button">
                        {createPostMutation.isPending ? "Creating..." : "Create Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5"/>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoriesLoading ? (Array.from({ length: 4 }).map(function (_, i) { return (<Skeleton key={i} className="h-12 w-full"/>); })) : categories ? (categories.map(function (category) { return (<Button key={category.id} variant={selectedCategory === category.id ? "default" : "ghost"} className="w-full justify-start" onClick={function () { return setSelectedCategory(category.id); }} data-testid={"category-".concat(category.id)}>
                    <i className={"".concat(category.icon || 'fas fa-comments', " mr-2")}></i>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.postCount} posts
                      </div>
                    </div>
                  </Button>); })) : (<div className="text-center py-4 text-muted-foreground">
                  No categories available
                </div>)}
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="lg:col-span-3">
          {!selectedCategory ? (<Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                  <h3 className="text-xl font-semibold mb-2">Select a Category</h3>
                  <p className="text-muted-foreground">
                    Choose a category from the sidebar to view posts
                  </p>
                </div>
              </CardContent>
            </Card>) : (<div className="space-y-4">
              {postsLoading ? (Array.from({ length: 5 }).map(function (_, i) { return (<Skeleton key={i} className="h-24 w-full"/>); })) : posts && posts.length > 0 ? (posts.map(function (post) { return (<Card key={post.id} className="hover:shadow-md transition-shadow" data-testid={"post-".concat(post.id)}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {post.isPinned && (<Badge variant="secondary" className="text-xs">
                                <Pin className="w-3 h-3 mr-1"/>
                                Pinned
                              </Badge>)}
                            {post.isLocked && (<Badge variant="outline" className="text-xs">
                                <Lock className="w-3 h-3 mr-1"/>
                                Locked
                              </Badge>)}
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-1" data-testid={"post-title-".concat(post.id)}>
                            {post.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            by <span className="font-medium">{post.authorId}</span> • 
                            <Clock className="w-3 h-3 inline mx-1"/>
                            {formatTimestamp(post.createdAt)}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4"/>
                            <span data-testid={"post-replies-".concat(post.id)}>
                              {post.replyCount || 0} replies
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>); })) : (<Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4"/>
                      <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to start a discussion in this category!
                      </p>
                      {user && (<Button onClick={function () { return setIsCreateDialogOpen(true); }} className="bg-primary hover:bg-primary/90" data-testid="create-first-post">
                          <Plus className="w-4 h-4 mr-2"/>
                          Create First Post
                        </Button>)}
                    </div>
                  </CardContent>
                </Card>)}
            </div>)}
        </div>
      </div>

      {!user && (<Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Join the Discussion</h3>
              <p className="text-muted-foreground mb-4">
                Login with Discord to create posts and participate in discussions
              </p>
            </div>
          </CardContent>
        </Card>)}
    </div>);
}
