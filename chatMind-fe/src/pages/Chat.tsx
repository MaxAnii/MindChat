import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Sparkles, LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Message sending logic will be implemented later
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Vector search logic will be implemented later
    console.log("Searching:", searchQuery);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={`${showSidebar ? "w-80" : "w-0"} transition-all duration-300 border-r border-border bg-muted/30 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-lg">ChatApp</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Semantic Search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by meaning..."
              className="pl-10 bg-background"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </form>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-3 cursor-pointer hover:bg-muted transition-smooth">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">User {i}</p>
                    <p className="text-xs text-muted-foreground truncate">Last message preview...</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">2m</span>
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">User 1</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Sample Messages */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Card className="inline-block p-3 max-w-md shadow-soft">
                <p className="text-sm">Hey! This is a sample message to show the chat interface.</p>
              </Card>
              <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <div className="flex-1 flex flex-col items-end">
              <Card className="inline-block p-3 max-w-md gradient-primary shadow-soft">
                <p className="text-sm text-white">This is your message with the gradient background!</p>
              </Card>
              <p className="text-xs text-muted-foreground mt-1">10:31 AM</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="gradient-primary shadow-primary">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;
