import React from "react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Progress } from "./progress";

/**
 * Test component to verify shadcn/ui light theme implementation
 * This component should show all elements with proper contrast and visibility
 */
export const TestComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Chess Academy UI Test - Light Theme Only
        </h1>

        {/* Button Test */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>Testing all button variants for visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Next Module</Button>
              <Button variant="outline">Previous Module</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Style</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small Button</Button>
              <Button size="default">Default Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Card Test */}
        <Card>
          <CardHeader>
            <CardTitle>Card Components</CardTitle>
            <CardDescription>Testing card borders and shadows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lesson Card</CardTitle>
                  <CardDescription>This card should have proper borders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">
                    All text should be clearly visible with proper contrast ratios.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Progress</CardTitle>
                  <CardDescription>Progress indicators should be visible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={33} />
                  <Progress value={66} />
                  <Progress value={100} />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Badge Test */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
            <CardDescription>Testing badge visibility and contrast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge variant="default">Beginner</Badge>
              <Badge variant="secondary">Intermediate</Badge>
              <Badge variant="destructive">Advanced</Badge>
              <Badge variant="outline">Expert</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Text Contrast Test */}
        <Card>
          <CardHeader>
            <CardTitle>Text Contrast Test</CardTitle>
            <CardDescription>All text elements should meet WCAG AA standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              <strong>Primary text:</strong> This should be dark and clearly readable.
            </p>
            <p className="text-muted-foreground">
              <strong>Muted text:</strong> This should be lighter but still readable.
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-foreground">Text on muted background should be visible</p>
              <p className="text-muted-foreground">Muted text on muted background</p>
            </div>
          </CardContent>
        </Card>

        {/* Critical CTA Test */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Critical Test: Navigation CTAs</CardTitle>
            <CardDescription>These buttons must be clearly visible - they were previously invisible!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <Button variant="outline">← Previous Module</Button>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
              </div>
              <Button variant="default">Next Module →</Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-muted-foreground">
          <p>✅ If all elements above are clearly visible with good contrast, the light theme fixes are successful!</p>
        </div>
      </div>
    </div>
  );
};