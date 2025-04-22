import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, BookOpen, MessageSquare, Mail, Phone, File, ChevronRight } from "lucide-react";

const Help = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <Button 
          variant="secondary" 
          size="sm" 
          className="gap-1 bg-wedding-gradient text-white hover:opacity-90"
        >
          Contact Support <ChevronRight size={16} />
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-blue-purple p-8 text-white">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">How can we help you today?</h2>
            <p className="text-white/80 mb-6">
              Find answers to your questions or contact our support team
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <LifeBuoy size={24} />, title: "Support Center" },
                { icon: <BookOpen size={24} />, title: "Documentation" },
                { icon: <MessageSquare size={24} />, title: "Live Chat" }
              ].map((item, i) => (
                <Card key={i} className="bg-white/10 border-none text-white hover:bg-white/20 transition-all">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="mb-3">{item.icon}</div>
                    <h3 className="font-semibold">{item.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="faq" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to commonly asked questions about our dashboard system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How do I create a new dashboard?",
                    answer: "To create a new dashboard, navigate to the Settings panel and click on 'Create Dashboard'. Follow the on-screen instructions to customize your new dashboard with widgets and data sources."
                  },
                  {
                    question: "Can I export my analytics data?",
                    answer: "Yes, you can export your data in various formats including CSV, PDF, and Excel. Look for the export button in the top-right corner of any analytics view."
                  },
                  {
                    question: "How do I add team members to my account?",
                    answer: "Go to Settings > Team Management and click 'Invite User'. Enter their email address and select their permission level, then click 'Send Invitation'."
                  },
                  {
                    question: "Is there a mobile app available?",
                    answer: "Yes, our mobile app is available for both iOS and Android devices. Search for 'DSD Dashboard' in your app store to download it."
                  },
                  {
                    question: "How do I connect external data sources?",
                    answer: "Navigate to Settings > Integrations to see a list of available data source connections. Click 'Connect' next to the service you want to integrate with."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our support team typically responds within 24 hours.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  support@dsddashboard.com
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Available Monday-Friday, 9am-5pm EST.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5 text-primary" /> Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Comprehensive guides and API documentation.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View Documentation
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Help;
