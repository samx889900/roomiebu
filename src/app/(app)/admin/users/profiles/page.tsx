import { getAdminUserProfiles } from "../../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, enumToLabel } from "@/lib/utils";
import { Mail, Phone, BookOpen, Sparkles, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminProfilesPage() {
  const users = await getAdminUserProfiles();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All User Profiles (Admin View)</h1>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const profile = user.profile;
          return (
            <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-16 bg-muted relative" />
              <CardContent className="p-5 pt-0 relative">
                <Avatar className="h-16 w-16 absolute -top-8 left-5 ring-4 ring-background">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-10 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-bold text-lg leading-tight truncate max-w-[200px]">{user.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{user.email}</span>
                      </div>
                      {profile?.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {profile ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 p-2 rounded">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <BookOpen className="w-3 h-3" /> Course
                        </div>
                        <span className="font-medium truncate block">{profile.course || "—"}</span>
                      </div>
                      <div className="bg-muted/50 p-2 rounded">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Sparkles className="w-3 h-3" /> Lifestyle
                        </div>
                        <span className="font-medium truncate block">
                          {profile.smoking === "NEVER" && profile.drinking === "NEVER" ? "Clean" : "Mixed"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Home className="w-3 h-3" /> Accommodation
                      </div>
                      <Badge variant="secondary" className="font-normal">
                        {profile.accommodationType ? enumToLabel(profile.accommodationType) : "Not Sure"}
                      </Badge>
                    </div>

                    {profile.languages && profile.languages.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Languages</div>
                        <div className="flex flex-wrap gap-1">
                          {profile.languages.slice(0, 3).map((l: string) => (
                            <Badge key={l} variant="outline" className="text-[10px] px-1.5 py-0">
                              {l}
                            </Badge>
                          ))}
                          {profile.languages.length > 3 && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              +{profile.languages.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                    No profile data yet
                  </div>
                )}
                
                <div className="mt-5 pt-4 border-t">
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 text-sm">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
