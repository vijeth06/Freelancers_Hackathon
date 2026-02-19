const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { env } = require('../src/config/env');
const User = require('../src/models/User');
const Meeting = require('../src/models/Meeting');
const Analysis = require('../src/models/Analysis');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Meeting.deleteMany({});
    await Analysis.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'SecurePass123',
        role: 'user',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'SecurePass123',
        role: 'user',
      },
      {
        name: 'Carol White',
        email: 'carol@example.com',
        password: 'SecurePass123',
        role: 'admin',
      },
    ]);
    console.log(`✓ Created ${users.length} users`);

    // Create sample meetings
    const meetings = await Meeting.create([
      {
        userId: users[0]._id,
        title: 'Q1 Sprint Planning',
        type: 'sprint-planning',
        rawContent: `
Team Meeting - Q1 2026 Sprint Planning
Date: February 19, 2026
Attendees: Alice, Bob, Dev Team

Objective: Plan Q1 sprint goals and technical implementation

Agenda Items:
1. Review Q4 metrics and lessons learned
   - 42 issues closed
   - 95% uptime achieved
   - Need to improve testing coverage

2. Q1 Goals
   - Implement AI analysis feature
   - Improve database performance
   - Add real-time notifications
   - Migrate to microservices

3. Technical Discussion
   - Use OpenAI GPT-4 for analysis
   - Implement Redis caching
   - Setup Kubernetes deployment

4. Team Assignments
   - Alice: Lead AI feature development
   - Bob: Database optimization
   - Carol: DevOps and deployment

5. Timeline
   - Feature freeze: March 15
   - Testing phase: March 15 - April 1
   - Production release: April 5

Action Items:
- Alice: Complete AI model integration by Feb 28
- Bob: Submit database optimization proposal by Feb 25
- Carol: Setup staging environment by Feb 23
- Team: Review and approve sprint plan by Feb 21

Next meeting: Feb 26 for progress check-in
        `,
        date: new Date('2026-02-19'),
        participants: ['Alice Johnson', 'Bob Smith', 'Dev Team'],
        tags: ['sprint', 'planning', 'q1', 'backend'],
      },
      {
        userId: users[1]._id,
        title: 'Daily Standup - Mobile Team',
        type: 'standup',
        rawContent: `
Daily Standup - Mobile Development Team
Date: February 19, 2026

What we did yesterday:
- Completed login UI redesign
- Fixed 3 critical bugs in payment flow
- Integrated push notification SDK

What we're doing today:
- Test new payment UI
- Implement gesture controls
- Deploy beta to TestFlight

Blockers:
- Waiting on API rate limit increase
- iOS build taking longer than expected

Progress: 85% of sprint tasks completed
        `,
        date: new Date('2026-02-19'),
        participants: ['Bob Smith', 'Mobile Team'],
        tags: ['standup', 'mobile', 'daily'],
      },
      {
        userId: users[2]._id,
        title: 'Client Meeting - Acme Corp',
        type: 'client-meeting',
        rawContent: `
Client Feedback Meeting - Acme Corporation
Date: February 18, 2026
Attendees: Carol White, Client Contact John Davis, Product Manager

Client Feedback:
- Very happy with new dashboard design
- Request: Add export to Excel feature
- Concern: Some reports are loading slowly

Discussion Points:
- Dashboard UX improvements are well-received
- Need to optimize report generation query
- Export feature would be valuable for quarterly reports
- Timeline for Excel export: 2-3 weeks

Client Wants:
1. Excel export for all reports
2. Scheduled report delivery via email
3. Custom date range queries
4. Data validation and audit logs

Next Steps:
- Carol to create feature spec for exports
- Schedule follow-up for March 5
- Send over performance analysis by Feb 25

Customer Satisfaction: 9/10
NPS: 8
        `,
        date: new Date('2026-02-18'),
        participants: ['Carol White', 'John Davis - Acme Corp'],
        tags: ['client', 'acme', 'feedback'],
      },
    ]);
    console.log(`✓ Created ${meetings.length} meetings`);

    // Create analyses for meetings
    const analyses = await Analysis.create([
      {
        meetingId: meetings[0]._id,
        userId: users[0]._id,
        version: 1,
        summary:
          'Q1 Sprint Planning session covering goals for AI analysis enhancement, database optimization, and infrastructure migration. Team discussed technical approach using OpenAI and Kubernetes deployment.',
        keyPoints: [
          'Q1 focused on AI analysis, database performance, and real-time notifications',
          '42 issues closed in Q4 with 95% uptime, need to improve testing',
          'AI feature will use OpenAI GPT-4 with Redis caching',
          'Timeline: Feature freeze Mar 15, Release Apr 5',
          'Clear role assignments: Alice (AI), Bob (DB), Carol (DevOps)',
        ],
        actionItems: [
          {
            task: 'Complete AI model integration',
            owner: 'Alice Johnson',
            deadline: '2026-02-28',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Submit database optimization proposal',
            owner: 'Bob Smith',
            deadline: '2026-02-25',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Setup staging environment',
            owner: 'Carol White',
            deadline: '2026-02-23',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Review and approve sprint plan',
            owner: 'Team',
            deadline: '2026-02-21',
            priority: 'Medium',
            status: 'Pending',
          },
          {
            task: 'Setup Kubernetes deployment',
            owner: 'Carol White',
            deadline: '2026-02-28',
            priority: 'High',
            status: 'Pending',
          },
        ],
        aiModel: 'fallback',
        tokenUsage: { prompt: 0, completion: 0, total: 0 },
      },
      {
        meetingId: meetings[1]._id,
        userId: users[1]._id,
        version: 1,
        summary:
          'Mobile team daily standup with 85% sprint completion. Completed login redesign and payment flow fixes. Main blocker is API rate limit increase for payments.',
        keyPoints: [
          'Login UI redesign completed',
          '3 critical payment flow bugs fixed',
          'Push notification SDK integrated',
          'API rate limit increase needed',
          '85% of sprint tasks completed',
        ],
        actionItems: [
          {
            task: 'Test new payment UI',
            owner: 'Bob Smith',
            deadline: '2026-02-19',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Implement gesture controls',
            owner: 'Mobile Team',
            deadline: '2026-02-20',
            priority: 'Medium',
            status: 'Pending',
          },
          {
            task: 'Deploy beta to TestFlight',
            owner: 'Bob Smith',
            deadline: '2026-02-19',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Request API rate limit increase',
            owner: 'Bob Smith',
            deadline: '2026-02-20',
            priority: 'High',
            status: 'Pending',
          },
        ],
        aiModel: 'fallback',
        tokenUsage: { prompt: 0, completion: 0, total: 0 },
      },
      {
        meetingId: meetings[2]._id,
        userId: users[2]._id,
        version: 1,
        summary:
          'Client meeting with Acme Corp covering dashboard satisfaction (9/10) and feature requests for Excel export, scheduled reports, and data validation. Performance optimization needed for slow reports.',
        keyPoints: [
          'Dashboard UX improvements well-received by client (9/10 satisfaction)',
          'Excel export feature requested for quarterly reports',
          'Report generation queries need optimization',
          'New requested features: scheduled email delivery, custom date ranges',
          'Audit logs and data validation also requested',
        ],
        actionItems: [
          {
            task: 'Create feature spec for Excel export',
            owner: 'Carol White',
            deadline: '2026-02-23',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Analyze and optimize report queries',
            owner: 'Bob Smith',
            deadline: '2026-02-25',
            priority: 'High',
            status: 'Pending',
          },
          {
            task: 'Send performance analysis to client',
            owner: 'Carol White',
            deadline: '2026-02-25',
            priority: 'Medium',
            status: 'Pending',
          },
          {
            task: 'Schedule follow-up meeting',
            owner: 'Carol White',
            deadline: '2026-03-05',
            priority: 'Medium',
            status: 'Pending',
          },
          {
            task: 'Implement scheduled report delivery via email',
            owner: 'Alice Johnson',
            deadline: '2026-03-10',
            priority: 'Medium',
            status: 'Pending',
          },
        ],
        aiModel: 'fallback',
        tokenUsage: { prompt: 0, completion: 0, total: 0 },
      },
    ]);
    console.log(`✓ Created ${analyses.length} analyses`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✅ Database seeded successfully!');
    console.log(`\nSeeded data:\n- ${users.length} users\n- ${meetings.length} meetings\n- ${analyses.length} analyses`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
