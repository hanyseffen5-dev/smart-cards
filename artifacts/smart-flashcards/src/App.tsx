import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { StudentProvider } from "@/lib/use-student";
import { clearImageReadyCache } from "@/lib/image-prefetch";
import { IMAGE_CACHE_VERSION } from "@/lib/image-cache-version";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import NewLesson from "./pages/NewLesson";
import LessonStudy from "./pages/LessonStudy";
import Pronunciation from "./pages/Pronunciation";
import MobileQr from "./pages/MobileQr";
import Progress from "./pages/Progress";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

function ImageCacheSync() {
  useEffect(() => {
    clearImageReadyCache();
  }, [IMAGE_CACHE_VERSION]);
  return null;
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/lessons" component={Lessons} />
        <Route path="/lessons/new" component={NewLesson} />
        <Route path="/lessons/:id" component={LessonStudy} />
        <Route path="/pronunciation" component={Pronunciation} />
        <Route path="/mobile" component={MobileQr} />
        <Route path="/progress" component={Progress} />
        <Route path="/favorites" component={Favorites} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <StudentProvider>
            <ImageCacheSync />
            <Router />
          </StudentProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
