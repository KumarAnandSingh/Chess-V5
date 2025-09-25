import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Crown, 
  BookOpen, 
  Puzzle, 
  Monitor, 
  Trophy, 
  BarChart3,
  User,
  Users,
  Settings,
  Bell,
  Award,
  TrendingUp,
  Target,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuthStore } from '../../stores/authStore'
import { cn } from '../../lib/utils'

const navigation = [
  { 
    name: 'Play', 
    href: '/play', 
    icon: Monitor, 
    description: 'Play against AI opponents',
    badge: 'Live',
    badgeColor: 'success'
  },
  { 
    name: 'Multiplayer', 
    href: '/multiplayer', 
    icon: Users, 
    description: 'Play rated games vs humans',
    badge: 'New',
    badgeColor: 'destructive'
  },
  { 
    name: 'Learn', 
    href: '/lessons', 
    icon: BookOpen, 
    description: 'Master chess fundamentals',
    badge: 'Free',
    badgeColor: 'primary'
  },
  { 
    name: 'Puzzles', 
    href: '/puzzles', 
    icon: Puzzle, 
    description: 'Sharpen your tactics',
    badge: 'Daily',
    badgeColor: 'warning'
  },
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: BarChart3, 
    description: 'Track your progress',
    showProgress: true
  },
  { 
    name: 'Strength Test', 
    href: '/strength-assessment', 
    icon: Target, 
    description: 'Find your rating level',
    badge: 'New',
    badgeColor: 'accent',
    divider: true 
  },
  { 
    name: 'Leaderboard', 
    href: '/leaderboard', 
    icon: Trophy, 
    description: 'Global rankings',
    showStats: true
  }
]

const secondaryNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation()
  const { user, deviceInfo, isAuthenticated, loginDemo } = useAuthStore()

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (deviceInfo.isMobile && isOpen) {
      onClose?.()
    }
  }, [location.pathname, deviceInfo.isMobile, isOpen, onClose])

  const sidebarContent = (
    <motion.div 
      className="flex flex-col h-full"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Enhanced Logo Section */}
      <div className={cn(
        "p-4 border-b mobile:p-6 flex items-center justify-between bg-gradient-to-r from-surface-elevated to-surface",
        "safe-left safe-right"
      )}>
        <Link 
          to="/dashboard" 
          className={cn(
            "flex items-center group transition-all duration-300",
            isCollapsed ? "justify-center w-full" : "space-x-3"
          )}
          onClick={onClose}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
            <Crown className={cn(
              "relative h-8 w-8 mobile:h-10 mobile:w-10 transition-all duration-300",
              "text-accent-primary group-hover:text-accent-primary-hover group-hover:scale-110"
            )} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg mobile:text-xl text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                Chess Academy
              </span>
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Master the Game
              </span>
            </div>
          )}
        </Link>
        
        {/* Desktop Toggle Button */}
        {!deviceInfo.isMobile && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapse}
            className="hidden md:flex"
            style={{ color: 'var(--color-text-secondary)' }}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* User info section - mobile only */}
      {deviceInfo.isMobile && (
        <div className="p-4 border-b bg-muted/20">
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.displayName}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Rating: 1200
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +50
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Welcome to Chess Academy!</p>
              <Button 
                onClick={loginDemo} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Try Demo Mode
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Primary Navigation */}
      <nav className={cn(
        "flex-1 p-4 space-y-1 mobile:p-6",
        "safe-left safe-right"
      )}>
        <div className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <div key={item.name}>
                {item.divider && (
                  <div className="my-3 border-t" style={{ borderColor: 'var(--color-border-default)' }} />
                )}
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full relative group transition-all duration-200",
                    isCollapsed 
                      ? "justify-center p-3 h-12" 
                      : "justify-start h-12 mobile:h-14 px-3",
                    "touch:h-14",
                    isActive && "bg-gradient-to-r from-accent-primary/20 to-transparent border-r-2 border-accent-primary text-accent-primary font-semibold",
                    !isActive && "hover:bg-surface-highlight hover:border-r-2 hover:border-border-interactive"
                  )}
                  asChild
                  title={isCollapsed ? item.name : undefined}
                >
                  <Link 
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center w-full"
                  >
                    <div className={cn(
                      "flex items-center justify-center rounded-lg transition-all duration-200",
                      isCollapsed ? "w-8 h-8" : "w-8 h-8 mr-3",
                      isActive ? "bg-accent-primary/20 text-accent-primary" : "text-text-secondary group-hover:text-accent-primary group-hover:bg-accent-primary/10"
                    )}>
                      <Icon className="h-4 w-4 mobile:h-5 mobile:w-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="flex-1">
                          <div className={cn(
                            "font-medium text-sm mobile:text-base transition-colors duration-200",
                            isActive ? "text-accent-primary" : "text-text-primary group-hover:text-accent-primary"
                          )}>
                            {item.name}
                          </div>
                          {deviceInfo.isMobile && (
                            <div className="text-xs text-text-muted mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {(item as any).badge && (
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            (item as any).badgeColor === 'success' && "bg-success/20 text-success",
                            (item as any).badgeColor === 'primary' && "bg-accent-primary/20 text-accent-primary",
                            (item as any).badgeColor === 'warning' && "bg-warning/20 text-warning",
                            (item as any).badgeColor === 'accent' && "bg-accent-secondary/20 text-accent-secondary"
                          )}>
                            {(item as any).badge}
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        {/* Secondary navigation - mobile only */}
        {deviceInfo.isMobile && (
          <div className="pt-4 mt-4 border-t space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Account
            </div>
            {secondaryNavigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3",
                    "h-10 mobile:h-12 text-sm mobile:text-base",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                  asChild
                >
                  <Link 
                    to={item.href}
                    onClick={onClose}
                  >
                    <Icon className="h-4 w-4 mobile:h-5 mobile:w-5" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        )}
      </nav>

      {/* Enhanced Bottom Section */}
      <div className={cn(
        "p-4 border-t bg-gradient-to-br from-surface-elevated to-surface mobile:p-6",
        "safe-left safe-right safe-bottom"
      )}>
        {isAuthenticated ? (
          <div className="space-y-4">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
                <div className="font-bold text-lg text-accent-primary">1200</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">Rating</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="font-bold text-lg text-success">+50</div>
                <div className="text-xs text-text-muted uppercase tracking-wide">This Week</div>
              </div>
            </div>
            
            {/* Enhanced Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">Level Progress</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-accent-primary">75%</span>
                  <div className="w-4 h-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-2.5 h-2.5 text-accent-primary" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-border-default rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-accent-primary to-accent-primary-hover rounded-full h-2 transition-all duration-700 ease-out"
                    style={{ width: '75%' }}
                  />
                </div>
                <div className="absolute -top-1 left-3/4 w-2 h-2 bg-accent-primary rounded-full shadow-lg animate-pulse" />
              </div>
            </div>
            
            {/* Achievement Badge */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent-secondary/10 border border-accent-secondary/20">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-accent-secondary" />
                <span className="text-sm font-medium text-text-primary">Achievements</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-accent-secondary">3</span>
                <div className="w-2 h-2 bg-accent-secondary rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="p-4 rounded-lg bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20">
              <Crown className="w-8 h-8 text-accent-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-text-primary mb-1">
                Start Your Chess Journey
              </p>
              <p className="text-xs text-text-muted">
                Track progress & unlock achievements
              </p>
            </div>
            <Button 
              onClick={loginDemo} 
              className="w-full bg-gradient-to-r from-accent-primary to-accent-primary-hover hover:from-accent-primary-hover hover:to-accent-primary-pressed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Get Started Free
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-mobile-overlay lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside 
        className={cn(
          "fixed left-0 z-mobile-nav w-72 mobile:w-80 transform border-r bg-background",
          "top-14 mobile:top-16 h-[calc(100vh-3.5rem)] mobile:h-[calc(100vh-4rem)]",
          "transition-transform duration-300 ease-out",
          "lg:relative lg:top-0 lg:h-full lg:translate-x-0 lg:w-64",
          "shadow-mobile-bottom lg:shadow-none"
        )}
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3 
        }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}

export default Sidebar